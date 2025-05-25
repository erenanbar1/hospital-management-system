"use client"

import { useState, useEffect } from "react"
import { FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

type HealthCardData = {
  testdate: string;
  cholesterol: string;
  glucose: string;
  hemoglobin: string;
  whitebloodcell: string;
  redbloodcell: string;
  prescriptiondate: string;
  usageinfo: string;
  medicationname: string;
  medicationformat: string;
  medicationdosage: string;
}

// Define a type for grouped prescriptions
type GroupedPrescription = {
  date: string;
  medications: Array<{
    name: string;
    format: string;
    dosage: string;
    usageinfo: string;
  }>;
}

export default function HealthCard() {
  const [healthCardData, setHealthCardData] = useState<HealthCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupedData, setGroupedData] = useState<{
    bloodTests: HealthCardData[];
    prescriptions: GroupedPrescription[];
  }>({ bloodTests: [], prescriptions: [] });
  const { toast } = useToast();
  const router = useRouter();

  // Get patient ID from localStorage - if not available, use a default value for testing
  const [patientId, setPatientId] = useState<string | null>(null);
  
  // Debug localStorage function
  const debugLocalStorage = () => {
    console.log("==== DEBUG: localStorage and sessionStorage contents ====");
    console.log("-- localStorage --");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const value = localStorage.getItem(key);
          console.log(`${key}: ${value}`);
        } catch (e) {
          console.log(`${key}: [Error reading value]`);
        }
      }
    }
    console.log("-- sessionStorage --");
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        try {
          const value = sessionStorage.getItem(key);
          console.log(`${key}: ${value}`);
        } catch (e) {
          console.log(`${key}: [Error reading value]`);
        }
      }
    }
    console.log("=================================================");
  };
  
  useEffect(() => {
    // Debug localStorage and sessionStorage contents
    debugLocalStorage();
    
    // Try multiple possible storage keys to find the user ID
    const possibleKeys = ["patientId", "userId", "user_id", "id", "u_id", "uid"];
    let foundId = null;
    
    // Check localStorage
    for (const key of possibleKeys) {
      const storedId = localStorage.getItem(key);
      if (storedId) {
        foundId = storedId;
        console.log(`Found user ID in localStorage under key '${key}': ${storedId}`);
        break;
      }
    }
    
    // Check sessionStorage if not found in localStorage
    if (!foundId) {
      for (const key of possibleKeys) {
        const storedId = sessionStorage.getItem(key);
        if (storedId) {
          foundId = storedId;
          console.log(`Found user ID in sessionStorage under key '${key}': ${storedId}`);
          break;
        }
      }
    }
    
    // Try to get user object if ID wasn't found directly
    if (!foundId) {
      // Check localStorage for user object
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          foundId = userData.id || userData.u_id || userData.user_id || userData.patientId;
          console.log("Found user ID in localStorage user object:", foundId);
        } catch (e) {
          console.error("Failed to parse user data from localStorage:", e);
        }
      }
      
      // Check sessionStorage for user object
      if (!foundId) {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            foundId = userData.id || userData.u_id || userData.user_id || userData.patientId;
            console.log("Found user ID in sessionStorage user object:", foundId);
          } catch (e) {
            console.error("Failed to parse user data from sessionStorage:", e);
          }
        }
      }
    }
    
    if (foundId) {
      setPatientId(foundId);
    } else {
      // If no user ID is found, show a specific error but continue to use fallback for development
      console.error("No user ID found in storage. Using fallback ID for development only.");
      
      // In development, use fallback
      if (process.env.NODE_ENV === 'development') {
        setPatientId("U0002"); // Changed to U0002 for testing
        toast({
          variant: "warning",
          title: "Development Mode",
          description: "Using fallback user ID (U0002) for development.",
        });
      } else {
        // In production, show error
        setError("User ID not found. Please log in again.");
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Cannot retrieve your health card without user ID. Please log in again.",
        });
      }
    }
  }, [toast]);

  // Group health card data by test date and prescription date
  useEffect(() => {
    if (!healthCardData.length) return;

    // Create map to store unique test dates
    const testDatesMap = new Map();
    // Create map to store medications grouped by prescription date
    const prescriptionDatesMap = new Map<string, GroupedPrescription>();

    healthCardData.forEach(item => {
      // Handle blood tests
      if (item.testdate && !testDatesMap.has(item.testdate)) {
        testDatesMap.set(item.testdate, item);
      }

      // Handle prescriptions
      if (item.prescriptiondate && item.medicationname) {
        if (!prescriptionDatesMap.has(item.prescriptiondate)) {
          prescriptionDatesMap.set(item.prescriptiondate, {
            date: item.prescriptiondate,
            medications: []
          });
        }

        // Add medication to the prescription
        prescriptionDatesMap.get(item.prescriptiondate)?.medications.push({
          name: item.medicationname,
          format: item.medicationformat,
          dosage: item.medicationdosage,
          usageinfo: item.usageinfo
        });
      }
    });

    // Convert maps to arrays
    setGroupedData({
      bloodTests: Array.from(testDatesMap.values()),
      prescriptions: Array.from(prescriptionDatesMap.values())
    });

  }, [healthCardData]);

  useEffect(() => {
    // Only proceed if we have a patientId
    if (!patientId) return;
    
    const fetchHealthCardData = async () => {
      try {
        setLoading(true);
        
        // Ensure we have a valid patient ID and correctly format the URL
        const apiUrl = `http://localhost:8000/api/get_health_card/${patientId}/`;
        console.log(`Fetching health card data from: ${apiUrl}`);
        
        const response = await fetch(apiUrl);
        
        if (response.status === 404) {
          throw new Error("Health card data not found. The API endpoint may be incorrect or the patient ID is invalid.");
        }
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setHealthCardData(data.healthCard);
          console.log("Successfully fetched health card data:", data.healthCard);
        } else {
          throw new Error(data.message || "Failed to fetch health card data");
        }
      } catch (err) {
        console.error("Error fetching health card data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load health card data. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHealthCardData();
  }, [patientId, toast]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Health Card
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Patient Information */}
          <div className="bg-cyan-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Patient ID:</span> {patientId || "Loading..."}
              </div>
              {/* Other patient info would go here */}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              <p>Failed to load health card data: {error}</p>
            </div>
          )}

          {/* No Data State */}
          {!loading && !error && healthCardData.length === 0 && (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p>No health card data available.</p>
            </div>
          )}

          {/* Blood Test Results */}
          {!loading && !error && groupedData.bloodTests.map((test, index) => (
            <Accordion key={`test-${index}`} type="single" collapsible className="w-full">
              <AccordionItem value={`bloodtest-${index}`}>
                <Card>
                  <CardHeader className="bg-cyan-500 text-white p-4">
                    <AccordionTrigger className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Blood Test</CardTitle>
                        <p className="text-cyan-100 text-sm">{test.testdate}</p>
                      </div>
                      <Badge variant="secondary" className="bg-white text-cyan-600">
                        Available
                      </Badge>
                    </AccordionTrigger>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-cyan-400 text-white">
                            <TableHead className="text-white">Test</TableHead>
                            <TableHead className="text-white">Value</TableHead>
                            <TableHead className="text-white">Reference Range</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Cholesterol</TableCell>
                            <TableCell>{test.cholesterol} mg/dL</TableCell>
                            <TableCell>&lt; 200 mg/dL</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Glucose</TableCell>
                            <TableCell>{test.glucose} mg/dL</TableCell>
                            <TableCell>70-100 mg/dL</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Hemoglobin</TableCell>
                            <TableCell>{test.hemoglobin} g/dL</TableCell>
                            <TableCell>13.5-17.5 g/dL</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>White Blood Cells</TableCell>
                            <TableCell>{test.whitebloodcell} K/uL</TableCell>
                            <TableCell>4.5-11.0 K/uL</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Red Blood Cells</TableCell>
                            <TableCell>{test.redbloodcell} M/uL</TableCell>
                            <TableCell>4.5-5.9 M/uL</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>
          ))}

          {/* Prescriptions - Grouped by Date */}
          {!loading && !error && groupedData.prescriptions.map((prescription, index) => (
            <Accordion key={`prescription-${index}`} type="single" collapsible className="w-full">
              <AccordionItem value={`prescription-${index}`}>
                <Card>
                  <CardHeader className="bg-cyan-500 text-white p-4">
                    <AccordionTrigger className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Prescription</CardTitle>
                        <p className="text-cyan-100 text-sm">{prescription.date}</p>
                      </div>
                      <Badge variant="secondary" className="bg-white text-cyan-600">
                        Available
                      </Badge>
                    </AccordionTrigger>
                  </CardHeader>
                  <AccordionContent>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-cyan-400 text-white">
                            <TableHead className="text-white">Name</TableHead>
                            <TableHead className="text-white">Format</TableHead>
                            <TableHead className="text-white">Dosage</TableHead>
                            <TableHead className="text-white">Usage Info</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {prescription.medications.map((med, medIndex) => (
                            <TableRow key={`med-${medIndex}`}>
                              <TableCell>{med.name}</TableCell>
                              <TableCell>{med.format}</TableCell>
                              <TableCell>{med.dosage}</TableCell>
                              <TableCell>{med.usageinfo}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            </Accordion>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
