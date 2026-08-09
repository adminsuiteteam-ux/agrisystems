import { CheckCircle2, Clock, Truck, Package, ShieldCheck, AlertTriangle, RefreshCw } from "lucide-react";

export type GroupStatus =
  | "open"
  | "partially_funded"
  | "funded"
  | "authorized"
  | "farmer_paid"
  | "in_transit"
  | "ready_pickup"
  | "distributing"
  | "completed"
  | "cancelled"
  | "refunded";

interface Props {
  status: GroupStatus | string;
}

export function GroupStatusBadge({ status }: Props) {
  switch (status) {
    case "open":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e1f0d9] px-3 py-1 text-xs font-bold text-[#2d6e30]">
          <Clock size={13} /> Open for joining
        </span>
      );
    case "partially_funded":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fcedd7] px-3 py-1 text-xs font-bold text-[#a66c1e]">
          <Clock size={13} /> Partially Funded
        </span>
      );
    case "funded":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dcf4e4] px-3 py-1 text-xs font-bold text-[#1f753d]">
          <CheckCircle2 size={13} /> Fully Funded
        </span>
      );
    case "authorized":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e0f0f8] px-3 py-1 text-xs font-bold text-[#1a6688]">
          <ShieldCheck size={13} /> Payment Authorized
        </span>
      );
    case "farmer_paid":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e3ecf7] px-3 py-1 text-xs font-bold text-[#23589c]">
          <CheckCircle2 size={13} /> Farmer Paid
        </span>
      );
    case "in_transit":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#faedd9] px-3 py-1 text-xs font-bold text-[#b0731f]">
          <Truck size={13} /> In Transit
        </span>
      );
    case "ready_pickup":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d8f3e5] px-3 py-1 text-xs font-bold text-[#196b3a]">
          <Package size={13} /> Ready for Pickup
        </span>
      );
    case "distributing":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef7db] px-3 py-1 text-xs font-bold text-[#567a21]">
          <Package size={13} /> Distributing
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e0eee3] px-3 py-1 text-xs font-bold text-[#1a542e]">
          <CheckCircle2 size={13} /> Completed
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
          <AlertTriangle size={13} /> Cancelled
        </span>
      );
    case "refunded":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800">
          <RefreshCw size={13} /> Refund Issued
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
          {status}
        </span>
      );
  }
}
