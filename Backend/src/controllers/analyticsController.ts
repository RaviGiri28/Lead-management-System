import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Lead } from "../entity/Lead";

const leadRepository = AppDataSource.getRepository(Lead);

export const getAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const totalLeads = await leadRepository.count();

    const metaLeads = await leadRepository.count({
      where: {
        source: "Meta Ads",
      },
    });

    const googleLeads = await leadRepository.count({
      where: {
        source: "Google Ads",
      },
    });

    const websiteLeads = await leadRepository.count({
      where: {
        source: "Website",
      },
    });

    const newLeads = await leadRepository.count({
      where: {
        status: "New",
      },
    });

    const contactedLeads = await leadRepository.count({
      where: {
        status: "Contacted",
      },
    });

    const followUpLeads = await leadRepository.count({
      where: {
        status: "Follow-Up",
      },
    });

    const convertedLeads = await leadRepository.count({
      where: {
        status: "Converted",
      },
    });

    const rejectedLeads = await leadRepository.count({
      where: {
        status: "Rejected",
      },
    });

    res.status(200).json({
      success: true,
      data: {
        totalLeads,

        sourceWise: {
          metaLeads,
          googleLeads,
          websiteLeads,
        },

        statusWise: {
          newLeads,
          contactedLeads,
          followUpLeads,
          convertedLeads,
          rejectedLeads,
        },
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};