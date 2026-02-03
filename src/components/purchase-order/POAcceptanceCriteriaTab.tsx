import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { AcceptanceCriteria } from '@/services/modules/purchase-orders';

interface POAcceptanceCriteriaTabProps {
    criteria: AcceptanceCriteria[];
}

export const POAcceptanceCriteriaTab: React.FC<POAcceptanceCriteriaTabProps> = ({ criteria }) => {
    const getStatusColor = (status: string) => {
        const colors = {
            pending: 'bg-gray-100 text-gray-800',
            met: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    if (!criteria || criteria.length === 0) {
        return (
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No acceptance criteria defined</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {criteria.map((item, index) => (
                <Card key={item.id}>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex-shrink-0">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-lg">{item.criteria}</CardTitle>
                                </div>
                            </div>
                            <Badge className={getStatusColor(item.status)}>
                                {item.status.toUpperCase()}
                            </Badge>
                        </div>
                    </CardHeader>
                    {item.verifiedAt && (
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Verified on: {new Date(item.verifiedAt).toLocaleDateString()}
                            </p>
                        </CardContent>
                    )}
                </Card>
            ))}
        </div>
    );
};
