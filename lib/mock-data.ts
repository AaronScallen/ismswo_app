import type { UserRole, WorkOrder } from "@/lib/contracts";

export const roleCards: Array<{
  role: UserRole;
  title: string;
  description: string;
  capability: string;
}> = [
  {
    role: "requester",
    title: "Requesters",
    description:
      "Faculty, staff, and site contacts can submit access, camera, and intrusion issues without joining the ISMS team.",
    capability: "Track open requests and review service history.",
  },
  {
    role: "secretary",
    title: "Secretary",
    description:
      "Screens inbound requests, corrects incomplete details, and keeps stakeholders informed when work is scheduled.",
    capability: "Triage and communication support.",
  },
  {
    role: "technician",
    title: "Technicians",
    description:
      "Work assigned jobs in the field, log updates, and close tickets after device testing and verification.",
    capability: "Execution and on-site service.",
  },
  {
    role: "sysadmin",
    title: "Systems Administrators",
    description:
      "Review new requests, validate system ownership, and route urgent issues into the correct maintenance queue.",
    capability: "Review, approve, and assign work.",
  },
  {
    role: "manager",
    title: "Manager",
    description:
      "Monitors workload, SLA pressure, and technician utilization across access control, video, and intrusion services.",
    capability: "Oversight and escalation control.",
  },
];

export const summaryStats = [
  { label: "Open Requests", value: "27", note: "+4 today" },
  { label: "Awaiting Review", value: "6", note: "2 urgent" },
  { label: "Assigned Today", value: "11", note: "8 technicians active" },
  { label: "Average Response", value: "2h 18m", note: "Within target" },
];

export const workOrders: WorkOrder[] = [
  {
    id: "WO-1042",
    title: "North lobby badge reader offline",
    requestedAt: "2026-04-29T08:14:00Z",
    requesterId: "demo-requester-1",
    requesterName: "Lena Price",
    requesterEmail: "lena.price@district.example",
    location: "North Campus, Building A, Main Entrance",
    system: "access-control",
    status: "assigned",
    assignedToUserId: "tech-1",
    assignedToName: "Marcus Green",
    priority: "high",
    description:
      "Card reader is unresponsive and door is remaining unlocked during business hours.",
  },
  {
    id: "WO-1043",
    title: "Parking lot camera blur after rain",
    requestedAt: "2026-04-29T09:02:00Z",
    requesterId: "demo-requester-2",
    requesterName: "Rita Gomez",
    requesterEmail: "rita.gomez@district.example",
    location: "Operations Center, South Parking Lot",
    system: "security-cameras",
    status: "under-review",
    assignedToUserId: null,
    assignedToName: null,
    priority: "normal",
    description:
      "Camera 7 image is fogged or out of focus after overnight rain; footage is unreadable.",
  },
  {
    id: "WO-1044",
    title: "Repeated intrusion alarm on west stairwell",
    requestedAt: "2026-04-29T10:37:00Z",
    requesterId: "demo-requester-3",
    requesterName: "Noah Edwards",
    requesterEmail: "noah.edwards@district.example",
    location: "Admin Annex, West Stairwell",
    system: "intrusion-detection",
    status: "in-progress",
    assignedToUserId: "tech-2",
    assignedToName: "Janelle Carter",
    priority: "high",
    description:
      "Alarm panel is generating repeated trouble alerts even after local reset.",
  },
  {
    id: "WO-1045",
    title: "Add access schedule for temporary contractor",
    requestedAt: "2026-04-29T11:08:00Z",
    requesterId: "demo-requester-4",
    requesterName: "Felix Turner",
    requesterEmail: "felix.turner@district.example",
    location: "Data Center, Receiving Entrance",
    system: "access-control",
    status: "submitted",
    assignedToUserId: null,
    assignedToName: null,
    priority: "low",
    description:
      "Need weekday access from 7 AM to 3 PM for electrical contractor through Friday.",
  },
];

export const requestLifecycle = [
  "Requester submits a work order with location, system type, email, timestamp, and issue summary.",
  "Secretary, systems administrators, or manager review the request and confirm priority.",
  "Manager or systems administrators assign the work order to a technician.",
  "Technician updates progress until the issue is resolved and the request is closed.",
];
