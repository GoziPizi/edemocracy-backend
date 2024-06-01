import ReportRepository from "@/repositories/ReportRepository";
import { ReportingType } from "@prisma/client";

class ModerationService {

    private static reportRepository: ReportRepository = new ReportRepository()

    static async report(id: string, type: ReportingType){
        this.reportRepository.createReport(id, type);
    }

    static async getReports(){
        return this.reportRepository.getReports();
    }

    static async deleteReport(id: string){
        this.reportRepository.deleteReport(id);
    }

    static async deleteTopic(id: string){
        
    }

    static async deleteComment(id: string){

    }

    static async deleteArgument(id: string){

    }

    static async deleteDebate(id: string){

    }

    static async deleteReformulation(id: string){

    }

    static async banUser(id: string){ }

}

export default ModerationService;