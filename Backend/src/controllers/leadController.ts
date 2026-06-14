import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Lead } from "../entity/Lead";
import { Like } from "typeorm";
import { DeviceToken } from "../entity/DeviceToken";
import { sendNotification } from "../utils/sendNotification";
import { Notification } from "../entity/Notification";

const leadRepository = AppDataSource.getRepository(Lead);

export const createLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      phone,
      email,
      source,
      campaignName,
    } = req.body;

    const lead = leadRepository.create({
      name,
      phone,
      email,
      source,
      campaignName,
    });

    const savedLead = await leadRepository.save(lead);
    const notificationRepo = AppDataSource.getRepository(Notification);
    await notificationRepo.save({
      title: "New Lead Received",
      message: `${savedLead.name} came from ${savedLead.source}`,
      read: false,
    });
    const tokenRepo = AppDataSource.getRepository(DeviceToken);
    const devices = await tokenRepo.find();
    console.log('device logged', devices);
      try {
        await Promise.all(
          devices.map(device =>
            sendNotification(
              device.token,
              "New Lead Received",
              `${savedLead.name} came from ${savedLead.source}`
            )
          )
        );
      } catch (error) {
        console.error("Notification failed:", error);
      }

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: savedLead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create lead",
    });
  }
};

export const getLeads = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { search, source, status } = req.query;

    const whereCondition: any = {};

    const allowedSources = [
      "Meta Ads",
      "Google Ads",
    ];

    const allowedStatuses = [
      "New",
      "Contacted",
      "Qualified",
      "Lost",
      "Converted",
    ];

    // Source Validation
    if (source) {
      if (!allowedSources.includes(source as string)) {
        res.status(400).json({
          success: false,
          message: "Invalid source",
        });
        return;
      }

      whereCondition.source = source;
    }

    // Status Validation
    if (status) {
      if (!allowedStatuses.includes(status as string)) {
        res.status(400).json({
          success: false,
          message: "Invalid status",
        });
        return;
      }

      whereCondition.status = status;
    }

    // Search
    if (search) {
      const leads = await leadRepository.find({
        where: [
          {
            ...whereCondition,
            name: Like(`%${search}%`),
          },
          {
            ...whereCondition,
            email: Like(`%${search}%`),
          },
          {
            ...whereCondition,
            phone: Like(`%${search}%`),
          },
        ],
        order: {
          createdAt: "DESC",
        },
      });

      res.status(200).json({
        success: true,
        count: leads.length,
        data: leads,
      });

      return;
    }

    const leads = await leadRepository.find({
      where: whereCondition,
      order: {
        createdAt: "DESC",
      },
    });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
};

export const getLeadById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const lead = await leadRepository.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lead",
    });
  }
};
export const updateLeadStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const lead = await leadRepository.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });
      return;
    }

    lead.status = status;

    const updatedLead = await leadRepository.save(lead);

    res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update lead status",
    });
  }
};
export const updateLeadRemarks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    const lead = await leadRepository.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });
      return;
    }

    lead.remarks = remarks;

    const updatedLead = await leadRepository.save(lead);

    res.status(200).json({
      success: true,
      message: "Remarks updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update remarks",
    });
  }
};
export const assignLead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    const lead = await leadRepository.findOne({
      where: {
        id: Number(id),
      },
    });

    if (!lead) {
      res.status(404).json({
        success: false,
        message: "Lead not found",
      });
      return;
    }

    lead.assignedTo = assignedTo;

    const updatedLead = await leadRepository.save(lead);

    res.status(200).json({
      success: true,
      message: "Lead assigned successfully",
      data: updatedLead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to assign lead",
    });
  }
};