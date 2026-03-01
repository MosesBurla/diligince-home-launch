import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  UserCheck, MapPin, Star, ShieldCheck, Clock, Award,
  Briefcase, ArrowLeft, Globe, CheckCircle2, Calendar,
  GraduationCap, Languages, Code, ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api.service";

interface ExperiencePosition {
  company: string;
  role: string;
  duration: string;
  description: string;
  isCurrent: boolean;
  startDate?: string;
  endDate?: string;
}

interface ProfessionalDetailProfile {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  specialization: string;
  expertise: string[];
  skills: string[];
  location: string;
  isVerified: boolean;
  verificationStatus: string;
  profileImage?: string;
  availability: {
    isAvailable: boolean;
    status: string;
    preferredProjects: string[];
    hourlyRate: number;
    minimumRate: number;
    maximumRate: number;
  };
  currency: string;
  rating: { average: number; count: number; breakdown: Record<string, number> };
  completedProjects: number;
  experience: { totalYears: number; positions: ExperiencePosition[] };
  education: { institution: string; degree: string; fieldOfStudy?: string; startYear?: number; endYear?: number }[];
  certifications: { name: string; issuer: string; dateObtained?: string; expiryDate?: string; isVerified?: boolean }[];
  workPreferences: { workType: string[]; projectDuration: string[]; industryPreferences: string[] };
  languages: { language: string; proficiency: string }[];
  contact: { linkedIn: string; portfolio: string; github: string; website: string };
}

const ProfessionalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState<ProfessionalDetailProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setHasError(false);
    api.get<{ success: boolean; data: ProfessionalDetailProfile }>(`/api/v1/hub/professionals/${id}`)
      .then((res: any) => {
        const data = res?.data ?? res;
        if (data?.success) {
          setProfessional(data.data);
        } else {
          setHasError(true);
        }
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (hasError || !professional) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <UserCheck className="w-16 h-16 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-semibold">Professional Not Found</h2>
          <p className="text-muted-foreground">This profile may not be verified or doesn't exist.</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const prof = professional;
  const initials = [prof.firstName, prof.lastName].map(n => n?.charAt(0)).filter(Boolean).join('').toUpperCase();
  const rateDisplay = prof.availability.hourlyRate > 0
    ? `₹${prof.availability.hourlyRate.toLocaleString('en-IN')}/hr`
    : prof.availability.minimumRate > 0
      ? `₹${prof.availability.minimumRate.toLocaleString('en-IN')} – ₹${prof.availability.maximumRate.toLocaleString('en-IN')}/hr`
      : 'Rate on request';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="bg-background border-b px-6 py-4 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Professionals
          </Button>
          <Badge className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Profile
          </Badge>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Hero Card */}
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5" />
          <div className="px-8 pb-8 -mt-10">
            <div className="flex items-end gap-6 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 border-4 border-background flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-2xl font-bold text-primary">{initials || 'P'}</span>
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-foreground">{prof.name}</h1>
                  <Badge className={`rounded-full text-xs ${prof.availability.isAvailable ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20' : 'bg-muted text-muted-foreground'}`}>
                    {prof.availability.isAvailable ? '● Available' : '● Busy'}
                  </Badge>
                </div>
                {prof.title && <p className="text-base text-primary font-medium mt-1">{prof.title}</p>}
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                  {prof.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{prof.location}</span>}
                  {prof.experience.totalYears > 0 && <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{prof.experience.totalYears} years exp</span>}
                  <span className="flex items-center gap-1 font-medium text-foreground">{rateDisplay}</span>
                </div>
              </div>
            </div>
            {prof.bio && <p className="text-sm text-muted-foreground leading-relaxed mb-4">{prof.bio}</p>}
            {prof.expertise.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {prof.expertise.map(e => (
                  <Badge key={e} variant="secondary" className="rounded-full px-3 py-1 text-xs">{e}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Star, label: 'Rating', value: `${prof.rating.average.toFixed(1)} / 5`, sub: `${prof.rating.count} reviews`, color: 'amber' },
            { icon: CheckCircle2, label: 'Projects Done', value: prof.completedProjects, color: 'green' },
            { icon: Briefcase, label: 'Experience', value: `${prof.experience.totalYears} yrs`, color: 'blue' },
            { icon: Clock, label: 'Response Time', value: 'Within 24h', color: 'purple' }
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className="bg-card rounded-xl border p-4 text-center hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center mx-auto mb-3`}>
                <Icon className={`w-5 h-5 text-${color}-500`} />
              </div>
              <div className="text-lg font-bold text-foreground">{value}</div>
              {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Skills */}
            {prof.skills.length > 0 && (
              <div className="bg-card rounded-2xl border p-6">
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" /> Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {prof.skills.map(s => (
                    <Badge key={s} variant="outline" className="rounded-full px-3 py-1 text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {prof.experience.positions.length > 0 && (
              <div className="bg-card rounded-2xl border p-6">
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" /> Work Experience
                </h2>
                <div className="space-y-5">
                  {prof.experience.positions.map((pos, i) => (
                    <div key={i} className="relative pl-4 border-l-2 border-primary/20">
                      <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-primary/40 border-2 border-background" />
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{pos.role}</p>
                          <p className="text-sm text-muted-foreground">{pos.company}</p>
                        </div>
                        {pos.isCurrent && (
                          <Badge className="text-xs rounded-full bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20 shrink-0">Current</Badge>
                        )}
                      </div>
                      {pos.duration && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" />{pos.duration}</p>}
                      {pos.description && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{pos.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {prof.education.length > 0 && (
              <div className="bg-card rounded-2xl border p-6">
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" /> Education
                </h2>
                <div className="space-y-4">
                  {prof.education.map((edu, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <GraduationCap className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{edu.institution}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{edu.degree}{edu.fieldOfStudy && ` · ${edu.fieldOfStudy}`}</p>
                        {(edu.startYear || edu.endYear) && (
                          <p className="text-xs text-muted-foreground mt-0.5">{edu.startYear} – {edu.endYear || 'Present'}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {prof.certifications.length > 0 && (
              <div className="bg-card rounded-2xl border p-6">
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" /> Certifications
                </h2>
                <div className="space-y-3">
                  {prof.certifications.map((cert, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Award className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{cert.name}</p>
                          {cert.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />}
                        </div>
                        {cert.issuer && <p className="text-xs text-muted-foreground mt-0.5">Issued by {cert.issuer}</p>}
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          {cert.dateObtained && new Date(cert.dateObtained).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                          {cert.expiryDate && `· Expires ${new Date(cert.expiryDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Verified */}
            <div className="bg-card rounded-2xl border p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" /> Verification
              </h3>
              <Badge className="w-full justify-center gap-1.5 bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30 rounded-xl py-2.5 text-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> Approved & Verified
              </Badge>
            </div>

            {/* Work Preferences */}
            {(prof.workPreferences.workType.length > 0 || prof.workPreferences.projectDuration.length > 0) && (
              <div className="bg-card rounded-2xl border p-5 space-y-3">
                <h3 className="text-sm font-semibold">Work Preferences</h3>
                {prof.workPreferences.workType.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1.5">Work Type</p>
                    <div className="flex flex-wrap gap-1.5">
                      {prof.workPreferences.workType.map(w => (
                        <Badge key={w} variant="secondary" className="text-xs rounded-full capitalize">{w}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {prof.workPreferences.projectDuration.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1.5">Duration</p>
                    <div className="flex flex-wrap gap-1.5">
                      {prof.workPreferences.projectDuration.map(d => (
                        <Badge key={d} variant="outline" className="text-xs rounded-full">{d.replace(/_/g, ' ')}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {prof.availability.preferredProjects.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1.5">Preferred Projects</p>
                    <div className="flex flex-wrap gap-1.5">
                      {prof.availability.preferredProjects.map(p => (
                        <Badge key={p} variant="outline" className="text-xs rounded-full">{p}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Languages */}
            {prof.languages.length > 0 && (
              <div className="bg-card rounded-2xl border p-5">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-primary" /> Languages
                </h3>
                <div className="space-y-2">
                  {prof.languages.map((l, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{l.language}</span>
                      <Badge variant="outline" className="text-xs rounded-full capitalize">{l.proficiency}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(prof.contact.linkedIn || prof.contact.portfolio || prof.contact.github || prof.contact.website) && (
              <div className="bg-card rounded-2xl border p-5">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" /> Links
                </h3>
                <div className="space-y-2">
                  {prof.contact.linkedIn && (
                    <a href={prof.contact.linkedIn} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <ExternalLink className="w-3.5 h-3.5" /> LinkedIn
                    </a>
                  )}
                  {prof.contact.portfolio && (
                    <a href={prof.contact.portfolio} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <ExternalLink className="w-3.5 h-3.5" /> Portfolio
                    </a>
                  )}
                  {prof.contact.github && (
                    <a href={prof.contact.github} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <ExternalLink className="w-3.5 h-3.5" /> GitHub
                    </a>
                  )}
                  {prof.contact.website && (
                    <a href={prof.contact.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline">
                      <Globe className="w-3.5 h-3.5" /> Website
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetails;
