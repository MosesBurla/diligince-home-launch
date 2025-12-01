import apiService from '../../core/api.service';
import { requirementsRoutes } from './requirements.routes';

class ApprovalSubmissionService {
  async submitForApproval(draftId: string, workflowConfig: any) {
    try {
      const response = await apiService.post(
        `/industry/requirements/draft/${draftId}/submit-for-approval`,
        workflowConfig
      );
      return response;
    } catch (error) {
      console.error("Failed to submit for approval:", error);
      throw error;
    }
  }
}

export default new ApprovalSubmissionService();
