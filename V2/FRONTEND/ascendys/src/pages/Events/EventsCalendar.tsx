import PageMeta from "@/components/common/PageMeta";
import PageHeader from "@/components/common/PageHeader";
import Button from "@/components/ui/button/Button";
import { useNavigate } from "react-router";
import { useApi } from "@/hooks/useApi";
import type { Event } from "@/types/content.types";
import Calendar from "@/components/calendar/Calendar";
import type { CalendarEvent } from "@/components/calendar/types";
import { useMemo, useState } from "react";
import EventDetailsModal from "@/components/events/EventDetailsModal";

export default function EventsCalendar() {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const {
    data: events,
    isLoading,
  } = useApi<Event[]>("/events/", { defaultValue: [] });

  // Map event types to calendar colors
  const getEventColor = (eventType: string): string => {
    const colorMap: Record<string, string> = {
      'CONFERENCE': 'Primary',
      'WORKSHOP': 'Success',
      'WEBINAR': 'Warning',
      'TRAINING': 'Danger',
      'TRADE_SHOW': 'Danger',
      'OTHER': 'Primary',
    };
    return colorMap[eventType] || 'Primary';
  };

  // Transform API events to Calendar events
  const calendarEvents = useMemo((): CalendarEvent[] => {
    const filtered = events.filter(event => event.status !== 'ARCHIVED');
    
    const transformed: CalendarEvent[] = [];
    
    filtered.forEach(event => {
      const startDate = new Date(event.start_datetime);
      const endDate = new Date(event.end_datetime);
      
      // Check if event spans multiple days
      const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
      const isMultiDay = endDay > startDay;
      
      if (isMultiDay) {
        // Create two separate cards: one for start date, one for end date
        const baseEvent = {
          id: event.id.toString(),
          title: event.title,
          allDay: true,
          extendedProps: {
            calendar: getEventColor(event.event_type),
            description: event.description,
            location: event.location,
            slug: event.slug,
            status: event.status,
          },
        };
        
        // Start date card
        transformed.push({
          ...baseEvent,
          id: `${event.id}-start`,
          title: `🟢 Début: ${event.title}`,
          start: startDate.toISOString().split('T')[0],
          end: startDate.toISOString().split('T')[0],
        });
        
        // End date card
        transformed.push({
          ...baseEvent,
          id: `${event.id}-end`,
          title: `🔴 Fin: ${event.title}`,
          start: endDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0],
        });
      } else {
        // Single day event - keep as is
        transformed.push({
          id: event.id.toString(),
          title: event.title,
          start: event.start_datetime,
          end: event.end_datetime,
          allDay: false,
          extendedProps: {
            calendar: getEventColor(event.event_type),
            description: event.description,
            location: event.location,
            slug: event.slug,
            status: event.status,
          },
        });
      }
    });
    
    return transformed;
  }, [events]);

  const handleAddEvent = () => {
    navigate("/admin/events/create");
  };

  const handleEventClick = (eventId: string) => {
    // Extract original event ID (remove -start or -end suffix for multi-day events)
    const originalId = eventId.replace(/-(start|end)$/, '');
    const event = events.find(e => e.id.toString() === originalId);
    if (event) {
      setSelectedEvent(event);
      setIsDetailsModalOpen(true);
    }
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      setIsDetailsModalOpen(false);
      navigate(`/admin/events/edit/${selectedEvent.slug}`);
    }
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <PageMeta 
        title="Calendrier des événements | Ascendys Connect" 
        description="Vue calendrier des événements" 
      />
      <PageHeader
        title="Calendrier des événements"
        description="Visualisez tous vos événements dans un calendrier"
        breadcrumbs={[
          { label: "Événements", path: "/admin/events" }, 
          { label: "Calendrier" }
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="inline-flex items-center gap-2"
              onClick={() => navigate("/admin/events")}
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Liste
            </Button>
            <Button 
              size="sm" 
              className="inline-flex items-center gap-2" 
              onClick={() => navigate("/admin/events/create")}
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouvel événement
            </Button>
          </div>
        }
      />

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block size-12 animate-spin rounded-full border-4 border-solid border-brand-500 border-e-transparent"></div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Chargement des événements...</p>
          </div>
        </div>
      )}

      {!isLoading && (
        <>
          <Calendar 
            events={calendarEvents}
            onAddEvent={handleAddEvent}
            onEventClick={handleEventClick}
          />
          
          {/* Legend */}
          {events.length > 0 && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Légende des types d'événements</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-brand-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Conférence / Autre</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-success-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Atelier</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-warning-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Webinaire</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-error-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Formation / Salon</span>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                💡 Le calendrier affiche tous les événements (brouillons et publiés). Les événements archivés sont masqués.
              </p>
            </div>
          )}
        </>
      )}

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        event={selectedEvent}
        onEdit={handleEditEvent}
      />
    </>
  );
}
