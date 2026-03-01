import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2, MapPin, Star, Shield, ShieldCheck, Clock, Award,
  Briefcase, Truck, Package, ArrowLeft, Globe, Phone, Mail,
  CheckCircle2, Calendar, BarChart3, ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api.service";

interface VendorDetailProfile {
  id: string;
  companyName: string;
  vendorType: string;
  vendorCategory: string;
  specialization: string[];
  primaryIndustry: string;
  yearsInBusiness: number;
  joinedDate: string;
  website: string;
  email: string;
  mobile: string;
  contactPerson: string;
  address: { city?: string; state?: string; country?: string; line1?: string };
  serviceAreas: string[];
  location: string;
  panNumber: string;
  gstNumber: string;
  isVerified: boolean;
  verificationStatus: string;
  rating: { average: number; count: number; breakdown: Record<string, number> };
  completedOrders: number;
  onTimeDeliveryRate: number;
  responseTime: string;
  qualityScore: number;
  serviceDetails: { serviceCategories?: string[]; specializations?: string[]; teamSize?: number; experienceYears?: number };
  productDetails: { productCategories: string[]; brands: string[] };
  logisticsDetails: { serviceTypes: string[]; coverage: string[]; fleet: any[] };
  certifications: { name: string; issuer: string; dateObtained?: string; expiryDate?: string; status?: string }[];
  qualityStandards: string[];
  paymentTerms: string[];
}

const VENDOR_TYPE_LABELS: Record<string, string> = {
  ServiceVendor: 'Service Vendor',
  ProductVendor: 'Product Vendor',
  LogisticsVendor: 'Logistics Vendor',
};

const StarRating: React.FC<{ value: number; size?: 'sm' | 'md' }> = ({ value, size = 'sm' }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'} ${i <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
      />
    ))}
  </div>
);

const VendorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorDetailProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setHasError(false);
    api.get<{ success: boolean; data: VendorDetailProfile }>(`/api/v1/hub/vendors/${id}`)
      .then((res: any) => {
        const data = res?.data ?? res;
        if (data?.success) {
          setVendor(data.data);
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
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (hasError || !vendor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Building2 className="w-16 h-16 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-semibold">Vendor Not Found</h2>
          <p className="text-muted-foreground">This vendor profile may not be verified or doesn't exist.</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const VendorTypeIcon = vendor.vendorType === 'LogisticsVendor' ? Truck
    : vendor.vendorType === 'ProductVendor' ? Package : Briefcase;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">

      {/* Page Header */}
      <div className="bg-background border-b px-6 py-4 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Vendors
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
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-primary/10 border-4 border-background flex items-center justify-center shadow-sm flex-shrink-0">
                <span className="text-2xl font-bold text-primary">
                  {(vendor.companyName || 'V').charAt(0).toUpperCase()}
                </span>
              </div>
              {/* Name + Type */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-foreground">{vendor.companyName}</h1>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-full">
                    <VendorTypeIcon className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">{VENDOR_TYPE_LABELS[vendor.vendorType] || vendor.vendorType}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                  {vendor.location && (
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{vendor.location}</span>
                  )}
                  {vendor.primaryIndustry && (
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{vendor.primaryIndustry}</span>
                  )}
                  {vendor.yearsInBusiness > 0 && (
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{vendor.yearsInBusiness} years in business</span>
                  )}
                </div>
              </div>
            </div>

            {/* Specializations */}
            {vendor.specialization?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {vendor.specialization.map(s => (
                  <Badge key={s} variant="secondary" className="rounded-full px-3 py-1 text-xs">{s}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Star, label: 'Rating', value: `${vendor.rating.average.toFixed(1)} / 5`, sub: `${vendor.rating.count} reviews`, color: 'amber' },
            { icon: CheckCircle2, label: 'Completed Orders', value: vendor.completedOrders, color: 'green' },
            { icon: Clock, label: 'Response Time', value: vendor.responseTime, color: 'blue' },
            { icon: BarChart3, label: 'On-Time Rate', value: `${vendor.onTimeDeliveryRate}%`, color: 'purple' }
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Service / Product / Logistics Details */}
            {vendor.vendorType === 'ServiceVendor' && (vendor.serviceDetails?.serviceCategories?.length || 0) > 0 && (
              <div className="bg-card rounded-2xl border p-6">
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" /> Services Offered
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Service Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {vendor.serviceDetails.serviceCategories!.map(s => (
                        <Badge key={s} variant="outline" className="rounded-full text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  {(vendor.serviceDetails.specializations?.length || 0) > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Specializations</p>
                      <div className="flex flex-wrap gap-2">
                        {vendor.serviceDetails.specializations!.map(s => (
                          <Badge key={s} variant="secondary" className="rounded-full text-xs">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {vendor.serviceDetails.teamSize && (
                    <p className="text-sm text-muted-foreground">Team Size: <span className="font-medium text-foreground">{vendor.serviceDetails.teamSize} people</span></p>
                  )}
                </div>
              </div>
            )}

            {vendor.vendorType === 'ProductVendor' && (
              <div className="bg-card rounded-2xl border p-6">
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" /> Product Details
                </h2>
                <div className="space-y-3">
                  {vendor.productDetails.productCategories.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Product Categories</p>
                      <div className="flex flex-wrap gap-2">
                        {vendor.productDetails.productCategories.map(c => (
                          <Badge key={c} variant="outline" className="rounded-full text-xs">{c}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {vendor.productDetails.brands.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Brands</p>
                      <div className="flex flex-wrap gap-2">
                        {vendor.productDetails.brands.map(b => (
                          <Badge key={b} variant="secondary" className="rounded-full text-xs">{b}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {vendor.vendorType === 'LogisticsVendor' && (
              <div className="bg-card rounded-2xl border p-6">
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" /> Logistics Details
                </h2>
                <div className="space-y-3">
                  {vendor.logisticsDetails.serviceTypes.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Service Types</p>
                      <div className="flex flex-wrap gap-2">
                        {vendor.logisticsDetails.serviceTypes.map(t => (
                          <Badge key={t} variant="outline" className="rounded-full text-xs">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {vendor.logisticsDetails.coverage.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Coverage Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {vendor.logisticsDetails.coverage.map(c => (
                          <Badge key={c} variant="secondary" className="rounded-full text-xs">{c}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {vendor.logisticsDetails.fleet.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Fleet</p>
                      <div className="space-y-2">
                        {vendor.logisticsDetails.fleet.map((f, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-foreground">{f.vehicleType}</span>
                            <span className="text-muted-foreground">{f.quantity} units · {f.capacity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Certifications */}
            {vendor.certifications.length > 0 && (
              <div className="bg-card rounded-2xl border p-6">
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" /> Certifications
                </h2>
                <div className="space-y-3">
                  {vendor.certifications.map((cert, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Award className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{cert.name}</p>
                        {cert.issuer && <p className="text-xs text-muted-foreground mt-0.5">Issued by {cert.issuer}</p>}
                        <div className="flex items-center gap-3 mt-1">
                          {cert.dateObtained && (
                            <span className="text-xs text-muted-foreground">
                              Obtained: {new Date(cert.dateObtained).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                            </span>
                          )}
                          {cert.expiryDate && (
                            <span className="text-xs text-muted-foreground">
                              Valid till: {new Date(cert.expiryDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                            </span>
                          )}
                          {cert.status === 'verified' && (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quality Standards */}
            {vendor.qualityStandards.length > 0 && (
              <div className="bg-card rounded-2xl border p-6">
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> Quality Standards
                </h2>
                <div className="flex flex-wrap gap-2">
                  {vendor.qualityStandards.map(q => (
                    <Badge key={q} className="rounded-full px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">{q}</Badge>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Verified Credentials */}
            <div className="bg-card rounded-2xl border p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" /> Verified Credentials
              </h3>
              <div className="space-y-3">
                {vendor.panNumber && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">PAN Number</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{vendor.panNumber}</code>
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    </div>
                  </div>
                )}
                {vendor.gstNumber && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">GST Number</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{vendor.gstNumber}</code>
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    </div>
                  </div>
                )}
                <div className="pt-1">
                  <Badge className="w-full justify-center gap-1.5 bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30 rounded-xl py-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> Profile Approved & Verified
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-card rounded-2xl border p-5">
              <h3 className="text-sm font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                {vendor.contactPerson && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold">{vendor.contactPerson.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{vendor.contactPerson}</p>
                      <p className="text-xs text-muted-foreground">Contact Person</p>
                    </div>
                  </div>
                )}
                {vendor.mobile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{vendor.mobile}</span>
                  </div>
                )}
                {vendor.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{vendor.email}</span>
                  </div>
                )}
                {vendor.website && (
                  <a href={vendor.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Globe className="w-3.5 h-3.5" />
                    <span className="truncate">{vendor.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-card rounded-2xl border p-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Location
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                {vendor.address.line1 && <p>{vendor.address.line1}</p>}
                <p>{[vendor.address.city, vendor.address.state, vendor.address.country || 'India'].filter(Boolean).join(', ')}</p>
              </div>
              {vendor.serviceAreas.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Service Areas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {vendor.serviceAreas.slice(0, 6).map(a => (
                      <Badge key={a} variant="outline" className="text-xs rounded-full">{a}</Badge>
                    ))}
                    {vendor.serviceAreas.length > 6 && (
                      <Badge variant="outline" className="text-xs rounded-full">+{vendor.serviceAreas.length - 6} more</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Terms */}
            {vendor.paymentTerms.length > 0 && (
              <div className="bg-card rounded-2xl border p-5">
                <h3 className="text-sm font-semibold mb-3">Payment Terms</h3>
                <div className="flex flex-wrap gap-1.5">
                  {vendor.paymentTerms.map(t => (
                    <Badge key={t} variant="secondary" className="text-xs rounded-full">{t}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailPage;
