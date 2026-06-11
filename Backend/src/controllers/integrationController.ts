import { Request, Response } from "express";
import { metaLeads } from "../seed/metaLeads";
import { googleLeads } from "../seed/googleLeads";
import { AppDataSource } from "../config/data-source";
import { Lead } from "../entity/Lead";

const leadRepository = AppDataSource.getRepository(Lead);
export const getMetaLeads = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.status(200).json({
        success: true,
        source: "Meta Ads",
        count: metaLeads.length,
        data: metaLeads,
    });
};

export const getGoogleLeads = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.status(200).json({
        success: true,
        source: "Google Ads",
        count: googleLeads.length,
        data: googleLeads,
    });
};

export const syncMetaLeads = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const savedLeads = [];

        for (const leadData of metaLeads) {

            const existingLead = await leadRepository.findOne({
                where: {
                    email: leadData.email,
                },
            });

            if (existingLead) {
                continue;
            }

            const lead = leadRepository.create(leadData);

            const savedLead = await leadRepository.save(lead);

            savedLeads.push(savedLead);
        }

        res.status(200).json({
            success: true,
            message: "Meta leads synced successfully",
            count: savedLeads.length,
            data: savedLeads,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to sync Meta leads",
        });
    }
};

export const syncGoogleLeads = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const savedLeads = [];

        for (const leadData of googleLeads) {

            const existingLead = await leadRepository.findOne({
                where: {
                    email: leadData.email,
                },
            });

            if (existingLead) {
                continue;
            }

            const lead = leadRepository.create(leadData);

            const savedLead = await leadRepository.save(lead);

            savedLeads.push(savedLead);
        }

        res.status(200).json({
            success: true,
            message: "Google leads synced successfully",
            count: savedLeads.length,
            data: savedLeads,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to sync Google leads",
        });
    }
};