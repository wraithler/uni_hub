import Layout from "@/components/core/Layout";
import PageHeader from "@/components/core/PageHeader";
import EventCreateForm from "@/components/events/EventCreateForm";

export default function EventCreatePage() {
  return (
    <Layout>
      <main className="container px-4 py-6 mx-auto">
        <PageHeader
          title="Create New Event"
          description="Organise a new event and share it with your community."
        />

        <div className="max-w-3xl mx-auto">
          <EventCreateForm />
        </div>
      </main>
    </Layout>
  );
}
