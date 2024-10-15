const Collaboration = require("../Models/CollaborationModel");
const Client = require("../Models/ClientModel");
const Coach = require("../Models/CoachModel");
const transporter = require("../Config/emailConfig");

exports.requestCollaboration = async (req, res) => {
  try {
    const { clientId, coachId } = req.body;

    // Check if client already has a pending or active collaboration
    const existingCollaboration = await Collaboration.findOne({
      client: clientId,
      status: { $in: ["pending", "accepted", "active"] },
    });

    if (existingCollaboration) {
      return res.status(400).json({
        message: "Client already has a pending or active collaboration",
      });
    }

    // Create new collaboration request
    const collaboration = new Collaboration({
      client: clientId,
      coach: coachId,
      status: "pending",
    });

    await collaboration.save();

    // Update client document
    await Client.findByIdAndUpdate(clientId, {
      $push: { collaborations: collaboration._id },
    });

    res.status(201).json({
      message: "Collaboration request sent successfully",
      collaboration,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating collaboration request",
      error: error.message,
    });
  }
};

exports.respondToCollaboration = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    const coachId = req.user._id;

    if (!coachId) {
      return res
        .status(400)
        .json({ message: "Coach ID not found in the request" });
    }

    const collaboration = await Collaboration.findById(id).populate(
      "client",
      "email firstName lastName"
    );

    if (!collaboration) {
      return res.status(404).json({ message: "Collaboration not found" });
    }

    if (collaboration.coach.toString() !== coachId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to respond to this collaboration" });
    }

    if (collaboration.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Can only respond to pending collaborations" });
    }

    if (response === "accept") {
      collaboration.status = "active";
      await Coach.findByIdAndUpdate(coachId, {
        $push: { collaborations: collaboration._id },
      });

      // Send acceptance email to client
      await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: collaboration.client.email,
        subject: "Collaboration Request Accepted",
        text: `Dear ${collaboration.client.firstName},\n\nYour collaboration request has been accepted by the coach. You can now start working together.\n\nBest regards,\nYour App Team`,
      });
    } else if (response === "decline") {
      collaboration.status = "declined";

      // Send rejection email to client
      await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: collaboration.client.email,
        subject: "Collaboration Request Declined",
        text: `Dear ${collaboration.client.firstName},\n\nWe regret to inform you that your collaboration request has been declined by the coach.\n\nBest regards,\nYour App Team`,
      });

      // Remove the collaboration from the client's list
      await Client.findByIdAndUpdate(collaboration.client._id, {
        $pull: { collaborations: collaboration._id },
      });
    } else {
      return res
        .status(400)
        .json({ message: 'Invalid response. Must be "accept" or "decline".' });
    }

    await collaboration.save();

    res
      .status(200)
      .json({
        message: `Collaboration ${collaboration.status}`,
        collaboration,
      });
  } catch (error) {
    console.error("Error in respondToCollaboration:", error);
    res
      .status(500)
      .json({
        message: "Error responding to collaboration",
        error: error.message,
      });
  }
};

exports.finishCollaboration = async (req, res) => {
  try {
    const { id } = req.params;
    const coachId = req.user._id;

    const collaboration = await Collaboration.findById(id).populate(
      "client",
      "email firstName lastName"
    );

    if (!collaboration) {
      return res.status(404).json({ message: "Collaboration not found" });
    }

    if (collaboration.coach.toString() !== coachId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to finish this collaboration" });
    }

    if (collaboration.status !== "active") {
      return res
        .status(400)
        .json({ message: "Can only finish active collaborations" });
    }

    collaboration.status = "completed";
    collaboration.endDate = new Date();
    await collaboration.save();

    // Send completion email to client
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: collaboration.client.email,
      subject: "Collaboration Completed",
      text: `Dear ${collaboration.client.firstName},\n\nYour collaboration has been marked as completed by the coach. We hope it was a successful experience!\n\nBest regards,\nYour App Team`,
    });

    res
      .status(200)
      .json({ message: "Collaboration marked as completed", collaboration });
  } catch (error) {
    console.error("Error in finishCollaboration:", error);
    res
      .status(500)
      .json({ message: "Error finishing collaboration", error: error.message });
  }
};

exports.getActiveClients = async (req, res) => {
  try {
    const coachId = req.user._id;

    if (!coachId) {
      return res
        .status(400)
        .json({ message: "Coach ID not found in the request" });
    }

    const activeCollaborations = await Collaboration.find({
      coach: coachId,
      status: "active",
    }).populate("client", "firstName lastName email profilePicture");

    if (activeCollaborations.length === 0) {
      return res
        .status(200)
        .json({ message: "No active clients found", activeClients: [] });
    }

    const activeClients = activeCollaborations.map((collab) => ({
      collaborationId: collab._id,
      clientId: collab.client._id,
      firstName: collab.client.firstName,
      lastName: collab.client.lastName,
      email: collab.client.email,
      profilePicture: collab.client.profilePicture,
      startDate: collab.startDate,
    }));

    res.status(200).json({
      message: "Active clients retrieved successfully",
      activeClients: activeClients,
    });
  } catch (error) {
    console.error("Error in getActiveClients:", error);
    res
      .status(500)
      .json({ message: "Error fetching active clients", error: error.message });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    console.log("Full req.user object:", req.user);
    const coachId = req.user ? req.user._id : undefined;

    console.log("Authenticated coach ID:", coachId);

    if (!coachId) {
      return res
        .status(400)
        .json({ message: "Coach ID not found in the request" });
    }

    const pendingRequests = await Collaboration.find({
      coach: coachId,
      status: "pending",
    }).populate("client", "firstName lastName email");

    console.log("Pending requests found:", pendingRequests.length);

    if (pendingRequests.length === 0) {
      const allPendingRequests = await Collaboration.find({
        status: "pending",
      });
      console.log(
        "All pending collaborations in the system:",
        allPendingRequests
      );
    }

    res.status(200).json({
      message: "Pending collaboration requests retrieved successfully",
      pendingRequests,
    });
  } catch (error) {
    console.error("Error in getPendingRequests:", error);
    res
      .status(500)
      .json({
        message: "Error fetching pending requests",
        error: error.message,
      });
  }
};
