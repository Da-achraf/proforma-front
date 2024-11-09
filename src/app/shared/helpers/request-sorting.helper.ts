import { RequestModel } from "../../models/request.model";
import { RequestStatus } from "../../models/requeststatus.model";
import { RoleEnum } from "../../models/user/user.model";

/**
 * Sorts an array of requests by created_at date
 * @param {RequestModel[]} requests - Array of request objects with created_at field
 * @param {string} order - Sort order: 'asc' or 'desc' (default: 'desc' [newest to oldest])
 * @returns {RequestModel[]}
 */
export const sortRequestsByDate = (requests: RequestModel[], order = 'desc') => {
    if (!Array.isArray(requests)) {
        throw new Error('Requests must be an array');
    }

    const multiplier = order.toLowerCase() === 'asc' ? 1 : -1;

    return [...requests].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);

        if (dateA.getTime() === dateB.getTime()) return 0;
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;

        return multiplier * (dateA < dateB ? -1 : 1);
    });
};


/**
 * Sorting class based on the builder pattern 
 * [so you can apply multiple chained sortings]
 * 
*/
type SortOrder = 'asc' | 'desc';
type SortFunction = (a: RequestModel, b: RequestModel) => number;

const ROLE_PRIORITY_STATUS: Record<RoleEnum, number[]> = {
    [RoleEnum.FINANCE_APPROVER]: [RequestStatus.PendingInFinance],
    [RoleEnum.TRADECOMPLIANCE_APPROVER]: [RequestStatus.PendingInTradCompliance],
    [RoleEnum.WAREHOUSE_APPROVER]: [RequestStatus.InShipping],
    [RoleEnum.ADMIN]: [],
    [RoleEnum.REQUESTER]: [],
    [RoleEnum.ALL]: [],
};

export class RequestSorterBuilder {
    private requests: RequestModel[];
    private sortFunctions: SortFunction[] = [];

    constructor(requests: RequestModel[]) {
        if (!Array.isArray(requests)) {
            throw new Error('Requests must be an array');
        }
        this.requests = [...requests];
    }

    /**
     * Sort by creation date
     * @param order Sort order ('asc' or 'desc')
     */
    byDate(order: SortOrder = 'desc'): this {
        const multiplier = order === 'asc' ? 1 : -1;
        
        this.sortFunctions.push((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);

            if (dateA.getTime() === dateB.getTime()) return 0;
            if (isNaN(dateA.getTime())) return 1;
            if (isNaN(dateB.getTime())) return -1;

            return multiplier * (dateA < dateB ? -1 : 1);
        });

        return this;
    }

    /**
     * Sort by user role relevance - prioritizing requests with status relevant to user's role
     * @param userRole Current user's role
     * @param order Sort order for requests with same relevance level
     */
    byRoleRelevance(userRole: RoleEnum): this {
        const priorityStatuses = ROLE_PRIORITY_STATUS[userRole] || [];

        this.sortFunctions.push((a, b) => {
            // Get priority indices for both requests
            const indexA = priorityStatuses.indexOf(a.status);
            const indexB = priorityStatuses.indexOf(b.status);

            // If both statuses are role-relevant, sort by their priority order
            if (indexA >= 0 && indexB >= 0) {
                return indexA - indexB;
            }

            // If only one status is role-relevant, prioritize it
            if (indexA >= 0) return -1;
            if (indexB >= 0) return 1;

            // If neither status is role-relevant, maintain their relative order
            return 0;
        });

        return this;
    }
    
    /**
     * Add custom sort function
     * @param sortFn Custom sort function
     */
    addCustomSort(sortFn: SortFunction): this {
        this.sortFunctions.push(sortFn);
        return this;
    }

    /**
     * Build and return the sorted array
     */
    build(): RequestModel[] {
        return this.requests.sort((a, b) => {
            for (const sortFn of this.sortFunctions) {
                const result = sortFn(a, b);
                if (result !== 0) return result;
            }
            return 0;
        });
    }
}

// Helper function to create a new builder instance
export const createRequestSorter = (requests: RequestModel[]): RequestSorterBuilder => {
    return new RequestSorterBuilder(requests);
};

