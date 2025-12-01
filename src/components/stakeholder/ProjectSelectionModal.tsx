
import React, { useState } from 'react';
import { BaseModal } from '@/components/shared/modals/BaseModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Calendar, DollarSign, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  description: string;
  category: 'product' | 'service' | 'logistics' | 'expert';
  budget: number;
  deadline: string;
  location: string;
  status: 'open' | 'in-progress' | 'closed';
  requirements: string[];
}

interface ProjectSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  stakeholderName: string;
  stakeholderId: string;
}

export const ProjectSelectionModal = ({ 
  isOpen, 
  onClose, 
  stakeholderName, 
  stakeholderId 
}: ProjectSelectionModalProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [invitationMessage, setInvitationMessage] = useState('');

  // Mock projects - in real app this would come from API
  const mockProjects: Project[] = [
    {
      id: '1',
      title: 'Industrial Equipment Procurement',
      description: 'Procurement of specialized industrial valves and control systems for manufacturing facility upgrade.',
      category: 'product',
      budget: 250000,
      deadline: '2024-03-15',
      location: 'Houston, TX',
      status: 'open',
      requirements: ['ISO 9001 Certified', 'API 6D Compliance', 'Local Support']
    },
    {
      id: '2',
      title: 'Process Optimization Consulting',
      description: 'Expert consultation for chemical process optimization and efficiency improvement.',
      category: 'expert',
      budget: 75000,
      deadline: '2024-02-28',
      location: 'Remote/On-site',
      status: 'open',
      requirements: ['Chemical Engineering Expertise', 'Six Sigma Certification', '10+ Years Experience']
    },
    {
      id: '3',
      title: 'Equipment Transportation Services',
      description: 'Specialized transportation for heavy industrial equipment from port to manufacturing site.',
      category: 'logistics',
      budget: 45000,
      deadline: '2024-01-30',
      location: 'Dallas, TX to Austin, TX',
      status: 'open',
      requirements: ['Heavy Haul License', 'Crane Services', 'Insurance Coverage']
    }
  ];

  const filteredProjects = mockProjects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'product': return 'bg-purple-100 text-purple-800';
      case 'service': return 'bg-blue-100 text-blue-800';
      case 'expert': return 'bg-green-100 text-green-800';
      case 'logistics': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleSendInvitation = () => {
    if (!selectedProject) {
      toast.error('Please select a project first');
      return;
    }

    // Create project-specific invitation
    const invitationData = {
      stakeholderId,
      stakeholderName,
      projectId: selectedProject.id,
      projectTitle: selectedProject.title,
      message: invitationMessage,
      invitedAt: new Date().toISOString()
    };

    console.log('Sending project invitation:', invitationData);

    toast.success(`Project invitation sent to ${stakeholderName}!`, {
      description: `${stakeholderName} has been invited to participate in "${selectedProject.title}"`
    });

    // Navigate to requirement creation with pre-filled data
    navigate(`/dashboard/create-requirement?project=${selectedProject.id}&stakeholder=${stakeholderId}`);
    onClose();
  };

  const handleCreateNewRequirement = () => {
    navigate('/dashboard/create-requirement');
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invite ${stakeholderName} to Project`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Projects List */}
        <div className="max-h-96 overflow-y-auto space-y-4">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className={`cursor-pointer transition-all ${
                selectedProject?.id === project.id
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleProjectSelect(project)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {project.description}
                    </CardDescription>
                  </div>
                  <Badge className={getCategoryColor(project.category)}>
                    {project.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>${project.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{new Date(project.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>{project.requirements.length} requirements</span>
                  </div>
                </div>
                
                {project.requirements.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Requirements:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.requirements.slice(0, 3).map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                      {project.requirements.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.requirements.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filteredProjects.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500 mb-4">No projects match your search criteria.</p>
              <Button onClick={handleCreateNewRequirement} className="bg-blue-600 hover:bg-blue-700">
                Create New Requirement
              </Button>
            </div>
          )}
        </div>

        {/* Selected Project Details */}
        {selectedProject && (
          <div className="border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-3">Add Personal Message (Optional)</h4>
            <Textarea
              value={invitationMessage}
              onChange={(e) => setInvitationMessage(e.target.value)}
              placeholder="Add a personal message to include with the project invitation..."
              className="min-h-[100px]"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            onClick={handleCreateNewRequirement}
            variant="outline"
          >
            Create New Requirement
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendInvitation}
              disabled={!selectedProject}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Send Project Invitation
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};
