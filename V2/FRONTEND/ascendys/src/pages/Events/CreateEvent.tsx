import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import EventForm from "@/components/events/EventForm";
import EventConflictModal from "@/components/events/EventConflictModal";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import eventsService from "@/services/events.service";
import type { EventFormData, Event } from "@/types/content.types";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [conflictingEvents, setConflictingEvents] = useState<Event[]>([]);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<EventFormData | null>(null);

  const { data: allEvents } = useApi<Event[]>("/events/", { defaultValue: [] });

  const checkForConflicts = (formData: EventFormData): Event[] => {
    const newStart = new Date(formData.start_datetime);
    const newEnd = new Date(formData.end_datetime);

    return allEvents.filter(event => {
      // Skip archived events
      if (event.status === 'ARCHIVED') return false;

      const eventStart = new Date(event.start_datetime);
      const eventEnd = new Date(event.end_datetime);

      // Check for overlap
      return (
        (newStart >= eventStart && newStart < eventEnd) ||
        (newEnd > eventStart && newEnd <= eventEnd) ||
        (newStart <= eventStart && newEnd >= eventEnd)
      );
    });
  };

  const handleSubmit = async (data: EventFormData) => {
    // Check for conflicts
    const conflicts = checkForConflicts(data);
    
    if (conflicts.length > 0) {
      setPendingFormData(data);
      setConflictingEvents(conflicts);
      setIsConflictModalOpen(true);
      return;
    }

    // No conflicts, proceed with creation
    await createEvent(data);
  };

  const createEvent = async (data: EventFormData) => {
    try {
      await eventsService.create(data);
      navigate("/admin/events");
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
      throw error;
    }
  };

  const handleConfirmWithConflict = async () => {
    if (pendingFormData) {
      await createEvent(pendingFormData);
      setPendingFormData(null);
      setConflictingEvents([]);
    }
  };

  const handleCancelConflict = () => {
    setIsConflictModalOpen(false);
    setPendingFormData(null);
    setConflictingEvents([]);
  };

  const handleCancel = () => {
    navigate("/admin/events");
  };

  return (
    <>
      <PageMeta
        title="Créer un événement | Ascendys Connect"
        description="Créer un nouvel événement"
      />
      <PageHeader
        title="Créer un événement"
        description="Ajoutez un nouvel événement à votre calendrier"
        breadcrumbs={[
          { label: "Événements", path: "/admin/events" },
          { label: "Créer" },
        ]}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <EventForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>

      {/* Conflict Modal */}
      <EventConflictModal
        isOpen={isConflictModalOpen}
        onClose={handleCancelConflict}
        conflictingEvents={conflictingEvents}
        onConfirm={handleConfirmWithConflict}
        onCancel={handleCancelConflict}
      />
    </>
  );
}
