import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader } from "lucide-react";
import { createEstimation, getEstimations, updateEstimation } from "../../api";
import { getInverterTypes, getProductDescriptions, getStructures } from "../../api/api";
import { solarPanelOptions, inverterOptions, structureOptions, gstOptions } from "../../lib/solarOptions";

interface Requirement {
  id?: string | number;
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile?: string;
  solar_service?: string;
  service_type?: string;
  door_no?: string;
  area?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  inverter_capacity?: string | number;
  amount?: number;
  gst?: number;
  product_description?: string;
  structure?: string;
}

const states = [
  "Andhra Pradesh",
  "Telangana",
  "Karnataka",
  "Tamil Nadu",
  "Maharashtra",
  "Rajasthan",
  "Gujarat",
  "Uttar Pradesh",
  "Others",
];

const districts: { [key: string]: string[] } = {
  "Andhra Pradesh": [
    "Alluri Sitharama Raju",
    "Anakapalli",
    "Anantapur",
    "Annamayya",
    "Bapatla",
    "Chittoor",
    "Dr. B.R. Ambedkar Konaseema",
    "East Godavari",
    "Eluru",
    "Guntur",
    "Kadapa (YSR)",
    "Kakinada",
    "Krishna",
    "Kurnool",
    "Manyam (Parvathipuram)",
    "Nandyal",
    "NTR",
    "Palnadu",
    "Prakasam",
    "Sri Potti Sriramulu Nellore",
    "Sri Sathya Sai",
    "Srikakulam",
    "Tirupati",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
  ],
  Telangana: [
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hanumakonda",
    "Hyderabad",
    "Jagtial",
    "Jangaon",
    "Jayashankar Bhupalpally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Komaram Bheem Asifabad",
    "Mahabubabad",
    "Mahabubnagar",
    "Mancherial",
    "Medak",
    "Medchal–Malkajgiri",
    "Mulugu",
    "Nagarkurnool",
    "Nalgonda",
    "Narayanpet",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Ranga Reddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal",
    "Yadadri Bhuvanagiri",
  ],
  Karnataka: [
    "Bangalore",
    "Belagavi",
    "Hubli-Dharwad",
    "Mysore",
    "Mangalore",
    "Kalaburagi",
    "Bijapur",
  ],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Salem",
    "Trichy",
    "Tiruppur",
    "Kanyakumari",
    "Ramanathapuram",
  ],
  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Aurangabad",
    "Nashik",
    "Kolhapur",
  ],
  Others: ["Other District"],
};

export function AddRequirementPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get("id");

  const [isLoading, setIsLoading] = useState(false);
  const [inverterTypes, setInverterTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [isLoadingInverters, setIsLoadingInverters] = useState(false);
  const [productDescriptions, setProductDescriptions] = useState<Array<{ id: number; name: string }>>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [structures, setStructures] = useState<Array<{ id: number; name: string }>>([]);
  const [isLoadingStructures, setIsLoadingStructures] = useState(false);

  const [formData, setFormData] = useState<Requirement>({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    solar_service: "",
    service_type: "",
    door_no: "",
    area: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    inverter_capacity: "",
    amount: 0,
    gst: 0,
    product_description: "",
    structure: "",
  });

  // Fetch inverter types, product descriptions, and structures
  useEffect(() => {
    let isMounted = true;

    const loadDataAsync = async () => {
      try {
        const token = localStorage.getItem('authToken');

        const [invertersResponse, productsResponse, structuresResponse] = await Promise.all([
          getInverterTypes(token || undefined),
          getProductDescriptions(token || undefined),
          getStructures(token || undefined)
        ]);

        if (isMounted) {
          if (invertersResponse.ok && Array.isArray(invertersResponse.data)) {
            setInverterTypes(invertersResponse.data);
          } else {
            setInverterTypes(
              inverterOptions.map((name, idx) => ({ id: idx + 1, name }))
            );
          }
          setIsLoadingInverters(false);

          if (productsResponse.ok && Array.isArray(productsResponse.data)) {
            setProductDescriptions(productsResponse.data);
          } else {
            setProductDescriptions(
              solarPanelOptions.map((name, idx) => ({ id: idx + 1, name }))
            );
          }
          setIsLoadingProducts(false);

          if (structuresResponse.ok && Array.isArray(structuresResponse.data)) {
            setStructures(structuresResponse.data);
          } else {
            setStructures(
              structureOptions.map((name, idx) => ({ id: idx + 1, name }))
            );
          }
          setIsLoadingStructures(false);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        if (isMounted) {
          setInverterTypes(
            inverterOptions.map((name, idx) => ({ id: idx + 1, name }))
          );
          setProductDescriptions(
            solarPanelOptions.map((name, idx) => ({ id: idx + 1, name }))
          );
          setStructures(
            structureOptions.map((name, idx) => ({ id: idx + 1, name }))
          );
          setIsLoadingInverters(false);
          setIsLoadingProducts(false);
          setIsLoadingStructures(false);
        }
      }
    };

    setIsLoadingInverters(true);
    setIsLoadingProducts(true);
    setIsLoadingStructures(true);
    loadDataAsync();

    return () => {
      isMounted = false;
    };
  }, []);

  // Load existing requirement data if editing
  useEffect(() => {
    if (editingId) {
      const loadExistingData = async () => {
        try {
          const response = await getEstimations();
          if (response.ok && response.data) {
            const requirement = Array.isArray(response.data.data)
              ? response.data.data.find((item: any) => item.id.toString() === editingId)
              : null;

            if (requirement) {
              setFormData({
                id: requirement.id,
                first_name: requirement.first_name || "",
                last_name: requirement.last_name || "",
                email: requirement.email || "",
                mobile: requirement.mobile || "",
                solar_service: requirement.solar_service || "",
                service_type: requirement.service_type || "",
                door_no: requirement.door_no || "",
                area: requirement.area || "",
                city: requirement.city || "",
                district: requirement.district || "",
                state: requirement.state || "",
                pincode: requirement.pincode || "",
                inverter_capacity: requirement.inverter_capacity || "",
                amount: parseFloat(requirement.amount) || 0,
                gst: parseFloat(requirement.gst) || 0,
                product_description: requirement.product_description || "",
                structure: requirement.structure || "",
              });
            }
          }
        } catch (error) {
          console.error("Error loading requirement:", error);
          toast.error("Failed to load requirement data");
        }
      };
      loadExistingData();
    }
  }, [editingId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "gst"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.first_name?.trim()) {
      toast.error("First name is required");
      return false;
    }
    if (!formData.last_name?.trim()) {
      toast.error("Last name is required");
      return false;
    }
    if (!formData.email?.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (!formData?.mobile?.trim()) {
      toast.error("Mobile number is required");
      return false;
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return false;
    }
    if (!formData.solar_service) {
      toast.error("Solar service is required");
      return false;
    }
    if (!formData.service_type) {
      toast.error("Service type is required");
      return false;
    }
    if (!formData.door_no?.trim()) {
      toast.error("Door No is required");
      return false;
    }
    if (!formData.area?.trim()) {
      toast.error("Area is required");
      return false;
    }
    if (!formData.city?.trim()) {
      toast.error("City is required");
      return false;
    }
    if (!formData.district) {
      toast.error("District is required");
      return false;
    }
    if (!formData.state) {
      toast.error("State is required");
      return false;
    }
    if (!formData.pincode?.trim()) {
      toast.error("Pincode is required");
      return false;
    }
    if (!formData.inverter_capacity || formData.inverter_capacity.toString().trim() === "") {
      toast.error("Inverter capacity is required");
      return false;
    }
    if (!formData.product_description?.trim()) {
      toast.error("Product description is required");
      return false;
    }
    if (!formData.structure?.trim()) {
      toast.error("Structure is required");
      return false;
    }
    if (!formData.amount || formData.amount <= 0) {
      toast.error("Amount is required and must be greater than 0");
      return false;
    }
    if (!formData.gst || formData.gst < 0 || formData.gst > 100) {
      toast.error("GST is required and must be between 0 and 100");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      if (editingId) {
        // EDIT MODE
        const apiPayload = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          mobile: formData.mobile,
          solar_service: formData.solar_service,
          service_type: formData.service_type,
          door_no: formData.door_no,
          area: formData.area,
          city: formData.city,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode,
          inverter_capacity: formData.inverter_capacity,
          product_description: formData.product_description,
          structure: formData.structure,
          gst: formData.gst,
          amount: formData.amount,
        };

        const response = await updateEstimation(editingId, apiPayload);

        if (response.ok) {
          toast.success("Requirement updated successfully!");
          navigate("/estimations");
        } else {
          toast.error(response.error || "Failed to update requirement");
        }
      } else {
        // CREATE MODE
        const apiPayload = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          mobile: formData.mobile,
          solar_service: formData.solar_service,
          service_type: formData.service_type,
          door_no: formData.door_no,
          area: formData.area,
          city: formData.city,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode,
          inverter_capacity: formData.inverter_capacity,
          product_description: formData.product_description,
          structure: formData.structure,
          gst: formData.gst,
          amount: formData.amount,
        };

        const response = await createEstimation(apiPayload);

        if (response.ok) {
          toast.success("Requirement captured successfully!");
          navigate("/estimations");
        } else {
          toast.error(response.error || "Failed to save requirement");
        }
      }
    } catch (error) {
      console.error("Error saving requirement:", error);
      toast.error("Failed to save requirement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="w-full max-w-5xl mx-auto px-6 py-4">
        {/* Back Button & Header */}
        <div className="mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/estimations")}
            className="mb-2 border-orange-300 text-orange-600 hover:bg-orange-50 h-8"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Back
          </Button>

          <h1 className="text-2xl font-bold mb-1">
            {editingId ? "Edit Requirement" : "Add Requirement"}
          </h1>
          <p className="text-xs text-gray-600">
            {editingId
              ? "Update the customer details and solar capacity requirements"
              : "Enter the customer details and solar capacity requirements"}
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-2">
          <CardHeader className="bg-blue-50 py-2 px-3">
            <CardTitle className="text-base">Form</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Customer Information Section */}
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-blue-700 border-b pb-1">
                  Customer
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="first_name" className="text-xs font-medium">
                      First Name *
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      placeholder="First"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="last_name" className="text-xs font-medium">
                      Last Name *
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      placeholder="Last"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="email" className="text-xs font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="mobile" className="text-xs font-medium">
                      Mobile *
                    </Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      placeholder="10-digit"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      maxLength={10}
                      required
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-blue-700 border-b pb-1">
                  Address
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="door_no" className="text-xs font-medium">
                      Door No *
                    </Label>
                    <Input
                      id="door_no"
                      name="door_no"
                      placeholder="45-B"
                      value={formData.door_no}
                      onChange={handleInputChange}
                      required
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="area" className="text-xs font-medium">
                      Area *
                    </Label>
                    <Input
                      id="area"
                      name="area"
                      placeholder="Area"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="state" className="text-xs font-medium">
                      State *
                    </Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => {
                        handleSelectChange("state", value);
                        handleSelectChange("district", "");
                      }}
                    >
                      <SelectTrigger id="state" className="h-8 text-xs">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="district" className="text-xs font-medium">
                      District *
                    </Label>
                    <Select
                      value={formData.district}
                      onValueChange={(value) =>
                        handleSelectChange("district", value)
                      }
                      disabled={!formData.state}
                    >
                      <SelectTrigger id="district" className="h-8 text-xs">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.state &&
                          districts[formData.state]?.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="city" className="text-xs font-medium">
                      City *
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="pincode" className="text-xs font-medium">
                      Pincode *
                    </Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      maxLength={6}
                      required
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Service Information Section */}
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-blue-700 border-b pb-1">
                  Service
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="solar_service" className="text-xs font-medium">
                      Solar Service *
                    </Label>
                    <Select
                      value={formData.solar_service}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, solar_service: value }))
                      }
                    >
                      <SelectTrigger id="solar_service" className="h-8 text-xs">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residential">Residential</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="service_type" className="text-xs font-medium">
                      Service Type *
                    </Label>
                    <Select
                      value={formData.service_type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, service_type: value }))
                      }
                    >
                      <SelectTrigger id="service_type" className="h-8 text-xs">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Installation">Installation</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Repair">Repair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Solar Capacity Section */}
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-blue-700 border-b pb-1">
                  Solar Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="inverter_capacity" className="text-xs font-medium">
                      Inverter *
                    </Label>
                    <Select
                      value={formData.inverter_capacity?.toString() || ""}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, inverter_capacity: value }))
                      }
                      disabled={isLoadingInverters}
                    >
                      <SelectTrigger id="inverter_capacity" className="h-8 text-xs">
                        <SelectValue
                          placeholder={
                            isLoadingInverters ? "Loading..." : "Select inverter type"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {inverterTypes.length > 0
                          ? inverterTypes.map((inverter) => (
                              <SelectItem key={inverter.id} value={inverter.name}>
                                {inverter.name}
                              </SelectItem>
                            ))
                          : inverterOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="product_description" className="text-xs font-medium">
                      Product *
                    </Label>
                    <Select
                      value={formData.product_description || ""}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, product_description: value }))
                      }
                      disabled={isLoadingProducts}
                    >
                      <SelectTrigger id="product_description" className="h-8 text-xs">
                        <SelectValue
                          placeholder={
                            isLoadingProducts
                              ? "Loading..."
                              : "Select solar panel product"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {productDescriptions.length > 0
                          ? productDescriptions.map((product) => (
                              <SelectItem key={product.id} value={product.name}>
                                {product.name}
                              </SelectItem>
                            ))
                          : solarPanelOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="structure" className="text-xs font-medium">
                      Structure *
                    </Label>
                    <Select
                      value={formData.structure || ""}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, structure: value }))
                      }
                      disabled={isLoadingStructures}
                    >
                      <SelectTrigger id="structure" className="h-8 text-xs">
                        <SelectValue
                          placeholder={
                            isLoadingStructures ? "Loading..." : "Select structure type"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {structures.length > 0
                          ? structures.map((struct) => (
                              <SelectItem key={struct.id} value={struct.name}>
                                {struct.name}
                              </SelectItem>
                            ))
                          : structureOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Amount and GST Section */}
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-blue-700 border-b pb-1">
                  Amount
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="amount" className="text-xs font-medium">
                      Amount *
                    </Label>
                    <Input
                      id="amount"
                      name="amount"
                      type="number"
                      placeholder="Amount"
                      value={formData.amount || ""}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <Label htmlFor="gst" className="text-xs font-medium">
                      GST % *
                    </Label>
                    <Select
                      value={formData.gst?.toString() || ""}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          gst: parseFloat(value),
                        }))
                      }
                    >
                      <SelectTrigger id="gst" className="h-8 text-xs">
                        <SelectValue placeholder="Select GST %" />
                      </SelectTrigger>
                      <SelectContent>
                        {gstOptions.map((option) => (
                          <SelectItem key={option} value={option.toString()}>
                            {option}%
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.amount &&
                    formData.amount > 0 &&
                    formData.gst &&
                    formData.gst > 0 && (
                      <div className="bg-blue-50 p-2 rounded-sm border border-blue-200">
                        <p className="text-xs font-semibold text-blue-900">
                          Total: ₹{formData.amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-blue-800">
                          Base: ₹{(formData.amount / (1 + formData.gst / 100)).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-xs text-blue-800 border-t border-blue-200 pt-1 mt-1">
                          GST: ₹
                          {(
                            formData.amount -
                            formData.amount /
                              (1 + formData.gst / 100)
                          ).toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/estimations")}
                  disabled={isLoading}
                  className="px-4 h-8 text-xs border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 h-8 text-xs bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-3 w-3 mr-1 animate-spin" />
                      {editingId ? "Updating..." : "Saving..."}
                    </>
                  ) : editingId ? (
                    "Update"
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
