
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import IndustryHeader from "@/components/industry/IndustryHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, CheckCircle, AlertCircle, DollarSign, Calendar, User, ShoppingCart, Brain, Users, MessageSquare } from "lucide-react";

interface WorkflowItem {
  id: string;
  title: string;
  type: "requirement" | "purchase_order" | "project";
  status: "draft" | "active" | "review" | "completed" | "approved";
  progress: number;
  amount?: number;
  deadline?: string;
  assignee: string;
  lastUpdated: string;
  nextAction: string;
}

const mockWorkflows: WorkflowItem[] = [
  {
    id: "REQ-001",
    title: "Industrial Valve Procurement",
    type: "requirement",
    status: "active",
    progress: 75,
    amount: 25000,
    deadline: "2024-01-15",
    assignee: "John Smith",
    lastUpdated: "2 hours ago",
    nextAction: "Vendor evaluation pending"
  },
  {
    id: "PO-042",
    title: "Safety Equipment Purchase Order",
    type: "purchase_order", 
    status: "approved",
    progress: 100,
    amount: 15000,
    deadline: "2024-01-10",
    assignee: "Sarah Johnson",
    lastUpdated: "1 day ago",
    nextAction: "Awaiting delivery"
  },
  {
    id: "PROJ-123",
    title: "Pipeline Inspection Service",
    type: "project",
    status: "active",
    progress: 45,
    amount: 35000,
    deadline: "2024-02-01",
    assignee: "Mike Wilson",
    lastUpdated: "3 hours ago",
    nextAction: "Milestone 2 in progress"
  }
];

const IndustryWorkflows = () => {
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredWorkflows = mockWorkflows.filter(workflow => {
    if (selectedTab === "all") return true;
    return workflow.type === selectedTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "review": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "approved": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "requirement": return <FileText className="h-4 w-4" />;
      case "purchase_order": return <ShoppingCart className="h-4 w-4" />;
      case "project": return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Clock className="h-4 w-4 text-green-600" />;
      case "review": return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "completed": 
      case "approved": return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Workflow Management | Diligince.ai</title>
      </Helmet>
      
      
      
      <main className="flex-1 container mx-auto px-4 py-8 pt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workflow Management</h1>
          <p className="text-gray-600">Track and manage all procurement workflows from requirements to completion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Requirements</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Matching</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">RFQ Sent</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <MessageSquare className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Quote Review</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Purchase Orders</p>
                  <p className="text-2xl font-bold text-gray-900">7</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Work & Payments</p>
                  <p className="text-2xl font-bold text-gray-900">$2.4M</p>
                </div>
                <DollarSign className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Workflows</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="ai_matching">AI Matching</TabsTrigger>
            <TabsTrigger value="rfq_sent">RFQ Sent</TabsTrigger>
            <TabsTrigger value="quote_review">Quote Review</TabsTrigger>
            <TabsTrigger value="purchase_orders">Purchase Orders</TabsTrigger>
            <TabsTrigger value="work_payments">Work & Payments</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {filteredWorkflows.map((workflow) => (
            <Card key={workflow.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
                      {getTypeIcon(workflow.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{workflow.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">ID: {workflow.id}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {workflow.assignee}
                        </div>
                        {workflow.deadline && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {new Date(workflow.deadline).toLocaleDateString()}
                          </div>
                        )}
                        {workflow.amount && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${workflow.amount.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(workflow.status)}
                    <Badge className={getStatusColor(workflow.status)}>
                      {workflow.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Progress</span>
                    <span>{workflow.progress}%</span>
                  </div>
                  <Progress value={workflow.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>Next Action: <span className="font-medium">{workflow.nextAction}</span></p>
                    <p>Last Updated: {workflow.lastUpdated}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/industry-project-workflow/${workflow.id}`}>
                        View Details
                      </Link>
                    </Button>
                    {workflow.status === "completed" && workflow.type === "requirement" && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                        <Link to={`/create-purchase-order?requirementId=${workflow.id}`}>
                          Create PO
                        </Link>
                      </Button>
                    )}
                    {workflow.type === "project" && workflow.progress === 100 && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
                        <Link to={`/work-completion-payment/${workflow.id}`}>
                          Process Payment
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default IndustryWorkflows;
