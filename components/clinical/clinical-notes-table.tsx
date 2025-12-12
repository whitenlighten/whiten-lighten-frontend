"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Eye,
  FileText,
  Calendar,
  User,
  Stethoscope,
  Filter,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
// import { getClinicalNotesAction } from "@/app/actions/clinical"

interface ClinicalNotesTableProps {
  userRole: string;
}

interface ClinicalNote {
  id: string;
  patientId: string;
  patientName: string;
  dentistId: string;
  dentistName: string;
  date: string;
  treatmentType: string;
  diagnosis: string;
  chiefComplaint: string;
  treatment: string;
  status: string;
  createdAt: string;
}

export function ClinicalNotesTable({ userRole }: ClinicalNotesTableProps) {
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<ClinicalNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadClinicalNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [clinicalNotes, searchTerm, statusFilter]);

  const loadClinicalNotes = async () => {
    setLoading(true);
    // try {
    //   const result = await getClinicalNotesAction()
    //   if (result.success) {
    //     setClinicalNotes(result.clinicalNotes || [])
    //   } else {
    //     toast.error("Failed to load clinical notes")
    //   }
    // } catch (error) {
    //   toast.error("Error loading clinical notes")
    // } finally {
    //   setLoading(false)
    // }
  };

  const filterNotes = () => {
    let filtered = clinicalNotes;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (note) =>
          note.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.treatmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.dentistName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((note) => note.status === statusFilter);
    }

    setFilteredNotes(filtered);
  };

  const toggleExpanded = (noteId: string) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId);
    } else {
      newExpanded.add(noteId);
    }
    setExpandedNotes(newExpanded);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            In Progress
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-800 text-xs">Draft</Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  const getTreatmentTypeColor = (type: string) => {
    const colors = {
      Consultation: "bg-purple-100 text-purple-800",
      Cleaning: "bg-green-100 text-green-800",
      Filling: "bg-yellow-100 text-yellow-800",
      "Root Canal": "bg-red-100 text-red-800",
      "Crown Placement": "bg-blue-100 text-blue-800",
      "Tooth Extraction": "bg-orange-100 text-orange-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <Card className="border-blue-100 w-full">
        <CardHeader>
          <CardTitle>Clinical Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 p-4 border rounded-lg animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0"></div>
                <div className="flex-1 space-y-2 w-full">
                  <div className="w-full sm:w-1/3 h-4 bg-gray-200 rounded"></div>
                  <div className="w-full sm:w-1/2 h-3 bg-gray-200 rounded"></div>
                  <div className="w-full sm:w-1/4 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded shrink-0"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-100 w-full">
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Clinical Notes ({filteredNotes.length})
          </CardTitle>

          {/* Mobile-first responsive filters */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-400"
              />
            </div>

            {/* Status Filter */}
            <div className="relative sm:w-auto">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                title="Select Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-blue-200 rounded-md focus:border-blue-400 focus:outline-none w-full sm:w-auto appearance-none bg-white">
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="draft">Draft</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 sm:px-6">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No clinical notes found</p>
            <p className="text-sm px-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Clinical notes will appear here after treatments"}
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredNotes.map((note) => {
              const isExpanded = expandedNotes.has(note.id);

              return (
                <div
                  key={note.id}
                  className="border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors overflow-hidden">
                  {/* Mobile Card Layout */}
                  <div className="block sm:hidden">
                    <div className="p-4 space-y-3">
                      {/* Header with badges */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2">
                            {note.chiefComplaint}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              className={`${getTreatmentTypeColor(
                                note.treatmentType
                              )} text-xs`}>
                              {note.treatmentType}
                            </Badge>
                            {getStatusBadge(note.status)}
                          </div>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-full shrink-0">
                          <FileText className="w-4 h-4 text-purple-600" />
                        </div>
                      </div>

                      {/* Patient and Date Info */}
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 shrink-0" />
                          <span className="truncate">{note.patientName}</span>
                          <span className="text-gray-400 text-xs">
                            ({note.patientId})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span>{formatDate(note.date)}</span>
                          </div>
                          <Link href={`/clinical/${note.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent text-xs px-3 py-1">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Expandable Details */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-gray-100 space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Stethoscope className="w-4 h-4 shrink-0" />
                            <span className="truncate">{note.dentistName}</span>
                          </div>
                          <div>
                            <p className="mb-1">
                              <strong>Diagnosis:</strong> {note.diagnosis}
                            </p>
                            <p>
                              <strong>Treatment:</strong> {note.treatment}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Expand/Collapse Button */}
                      <button
                        onClick={() => toggleExpanded(note.id)}
                        className="w-full text-center text-blue-600 text-sm font-medium py-2 border-t border-gray-100 hover:bg-blue-50 transition-colors">
                        {isExpanded ? "Show Less" : "Show More"}
                      </button>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-start justify-between p-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-purple-100 rounded-full shrink-0">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2 flex-wrap">
                          <h3 className="font-medium text-gray-900">
                            {note.chiefComplaint}
                          </h3>
                          <Badge
                            className={getTreatmentTypeColor(
                              note.treatmentType
                            )}>
                            {note.treatmentType}
                          </Badge>
                          {getStatusBadge(note.status)}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-4 text-sm text-gray-600 flex-wrap gap-y-1">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{note.patientName}</span>
                              <span className="text-gray-400">
                                ({note.patientId})
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Stethoscope className="w-4 h-4" />
                              <span>{note.dentistName}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(note.date)}</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p className="mb-1">
                              <strong>Diagnosis:</strong> {note.diagnosis}
                            </p>
                            <p className="line-clamp-2">
                              <strong>Treatment:</strong> {note.treatment}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4 shrink-0">
                      <Link href={`/clinical/${note.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
