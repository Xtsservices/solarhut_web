import { useState, useEffect } from "react";
// Local mock data and types (fallback for missing ../../lib/mockData)
type Enquiry = {
  id: string;
  userName: string;
  kv: string;
  location: string;
  date: string;
  status: string;
  assignedTo?: string;
  salesPersonId?: string;
  mobile?: string;
  notes?: string;
};

const mockEmployees = [
  { id: "emp1", name: "Alice Johnson", role: "Sales" },
  { id: "emp2", name: "Bob Smith", role: "Sales" },
  { id: "emp3", name: "Eve Manager", role: "Admin" },
];

const mockEnquiries: Enquiry[] = [
  {
    id: "ENQ-001",
    userName: "John Doe",
    kv: "5kW",
    location: "Hyderabad",
    date: new Date().toISOString(),
    status: "New",
    assignedTo: "",
    salesPersonId: "",
    mobile: "9876543210",
    notes: "Interested in rooftop installation",
  },
  {
    id: "ENQ-002",
    userName: "Jane Smith",
    kv: "3kW",
    location: "Bengaluru",
    date: new Date().toISOString(),
    status: "Pending",
    assignedTo: "",
    salesPersonId: "",
    mobile: "9123456780",
    notes: "Requested quote",
  },
];
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Eye } from "lucide-react";
import { toast } from "sonner";

export function EnquiryManagement() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(mockEnquiries);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState("");

  const salesPersons = mockEmployees.filter(emp => emp.role === "Sales");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Assigned":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Pending":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      default:
        return "";
    }
  };

  const handleViewEnquiry = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setAssignDialogOpen(true);
    setSelectedSalesPerson(enquiry.salesPersonId || "");
  };

  const handleAssign = () => {
    if (!selectedEnquiry || !selectedSalesPerson) return;

    const salesPerson = salesPersons.find(sp => sp.id === selectedSalesPerson);
    if (!salesPerson) return;

    setEnquiries((prev: Enquiry[]) =>
      prev.map((enq: Enquiry) =>
        enq.id === selectedEnquiry.id
          ? { ...enq, status: "Assigned", assignedTo: salesPerson.name, salesPersonId: selectedSalesPerson }
          : enq
      )
    );

    toast.success(`Enquiry assigned to ${salesPerson.name}`);
    setAssignDialogOpen(false);
    setSelectedEnquiry(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Enquiry Management</h1>
        <p className="text-muted-foreground">Manage and assign customer enquiries</p>
        <div className="text-sm text-muted-foreground">Showing {enquiries.length} enquiries</div>
      </div>

      <div className="bg-white rounded-lg border border-border">
        {enquiries.length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground">No enquiries to display</div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>KV</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.map((enquiry: Enquiry) => (
              <TableRow key={enquiry.id}>
                <TableCell>{enquiry.id}</TableCell>
                <TableCell>{enquiry.userName}</TableCell>
                <TableCell>{enquiry.kv}</TableCell>
                <TableCell>{enquiry.location}</TableCell>
                <TableCell>{new Date(enquiry.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(enquiry.status)}>{enquiry.status}</Badge>
                </TableCell>
                <TableCell>{enquiry.assignedTo || "-"}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleViewEnquiry(enquiry)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View & Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
            <DialogDescription className="sr-only">
              View enquiry information and assign to sales person
            </DialogDescription>
          </DialogHeader>
          {selectedEnquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Enquiry ID</div>
                  <div>{selectedEnquiry.id}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div>{new Date(selectedEnquiry.date).toLocaleDateString()}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Customer Name</div>
                <div>{selectedEnquiry.userName}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">KV Required</div>
                  <div>{selectedEnquiry.kv}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Mobile</div>
                  <div>{selectedEnquiry.mobile}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Location</div>
                <div>{selectedEnquiry.location}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Notes</div>
                <div>{selectedEnquiry.notes}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge className={getStatusColor(selectedEnquiry.status)}>{selectedEnquiry.status}</Badge>
              </div>

              <div className="border-t pt-4">
                <Label htmlFor="sales-person">Assign Sales Person</Label>
                <Select value={selectedSalesPerson} onValueChange={setSelectedSalesPerson}>
                  <SelectTrigger id="sales-person" className="mt-2">
                    <SelectValue placeholder="Select sales person" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesPersons.map((sp) => (
                      <SelectItem key={sp.id} value={sp.id}>
                        {sp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleAssign}
                disabled={!selectedSalesPerson}
                className="w-full bg-primary hover:bg-primary/90 text-black"
              >
                Confirm Assignment
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
