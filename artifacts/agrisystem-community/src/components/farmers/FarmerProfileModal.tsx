import { ShieldCheck, MapPin, Calendar, Award, Star, CheckCircle, X } from "lucide-react";

export interface FarmerProfileData {
  id: string;
  farmName: string;
  farmLocation: string;
  description: string;
  verificationStatus: "verified" | "pending" | "rejected";
  farmPhotos?: string[];
  farmerName?: string;
  farmerPhone?: string;
  farmerTrustScore?: number;
  qualityDetails?: string;
  harvestDate?: string;
  fulfillmentHistory?: {
    totalFulfilled?: number;
    onTimeDeliveryRate?: number;
    rating?: number;
  };
}

interface Props {
  farmer: FarmerProfileData;
  onClose: () => void;
}

export function FarmerProfileModal({ farmer, onClose }: Props) {
  const isVerified = farmer.verificationStatus === "verified";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173a28]/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#e7dfd2] bg-[#fffefa] p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#eee8dd] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#b17a2d]">
                Farmer Trust Profile
              </span>
              {isVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#dcf4e4] px-2.5 py-0.5 text-[11px] font-bold text-[#1f753d]">
                  <ShieldCheck size={13} /> Verified Supplier
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                  Pending Verification
                </span>
              )}
            </div>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-[#174f34]">{farmer.farmName}</h2>
            <p className="flex items-center gap-1 text-xs font-semibold text-[#6a776c]">
              <MapPin size={14} className="text-[#a0712d]" /> {farmer.farmLocation}
            </p>
          </div>
          <button
            onClick={onClose}
            data-testid="button-close-farmer-modal"
            className="rounded-full p-2 text-[#68786d] hover:bg-[#f0ebe1]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Farmer Photo Gallery */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {(farmer.farmPhotos && farmer.farmPhotos.length > 0
            ? farmer.farmPhotos
            : [
                "https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&auto=format&fit=crop&q=80",
              ]
          ).map((src, i) => (
            <div key={i} className="h-28 overflow-hidden rounded-xl bg-[#f2ebd9]">
              <img src={src} alt={`${farmer.farmName} photo ${i + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        {/* Overview Stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-[#e4dccf] bg-[#fcf9f2] p-3 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#818c83]">Trust Rating</div>
            <div className="mt-1 flex items-center justify-center gap-1 font-display text-xl font-extrabold text-[#1c6039]">
              <Star size={16} className="fill-[#e0a140] text-[#e0a140]" />
              {farmer.fulfillmentHistory?.rating || 4.9} / 5.0
            </div>
          </div>
          <div className="rounded-2xl border border-[#e4dccf] bg-[#fcf9f2] p-3 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#818c83]">Orders Fulfilled</div>
            <div className="mt-1 font-display text-xl font-extrabold text-[#1c6039]">
              {farmer.fulfillmentHistory?.totalFulfilled || 48} groups
            </div>
          </div>
          <div className="rounded-2xl border border-[#e4dccf] bg-[#fcf9f2] p-3 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#818c83]">On-Time Rate</div>
            <div className="mt-1 font-display text-xl font-extrabold text-[#1c6039]">
              {farmer.fulfillmentHistory?.onTimeDeliveryRate || 99}%
            </div>
          </div>
        </div>

        {/* Farm & Produce Details */}
        <div className="mt-5 space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#526b58]">About the Farm</h3>
            <p className="mt-1 text-sm leading-6 text-[#637167]">
              {farmer.description ||
                "A community-trusted agricultural producer focused on clean harvesting, standard sorting, and farm-fresh delivery straight to urban community pickup points across Nigeria."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#e5dcd0] bg-[#fffefa] p-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#326744]">
                <Calendar size={15} /> Expected Harvest Window
              </div>
              <p className="mt-1 text-xs text-[#6e7b71]">
                {farmer.harvestDate || "Freshly harvested every 14 days"}
              </p>
            </div>

            <div className="rounded-xl border border-[#e5dcd0] bg-[#fffefa] p-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#326744]">
                <Award size={15} /> Quality Assurance Standard
              </div>
              <p className="mt-1 text-xs text-[#6e7b71]">
                {farmer.qualityDetails || "Grade-A sorted, sun-dried, zero synthetic preservatives."}
              </p>
            </div>
          </div>

          {/* Verification Badges */}
          <div className="rounded-2xl border border-[#dbebd7] bg-[#f4faf2] p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#245e38]">
              Agrisystems Verification Checklist
            </h4>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                "Farm location physically inspected",
                "Farmer identity & phone verified",
                "Product sample batch tested",
                "Direct payment agreement active",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-[#41624a]">
                  <CheckCircle size={14} className="text-[#3a8b41]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-[#eee8dd] pt-4 text-right">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#1c6039] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#14482b]"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
