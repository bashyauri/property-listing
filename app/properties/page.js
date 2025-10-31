import Pagination from "@/components/Pagination";
import PropertyCard from "@/components/PropertyCard";
import connectDB from "@/config/database";
import Property from "@/models/Property";

async function PropertiesPage({ searchParams }) {
  const params = await searchParams; // ✅ wait for it
  const page = parseInt(params?.page || 1);
  const pageSize = parseInt(params?.pageSize || 9);

  await connectDB();

  const skip = (page - 1) * pageSize;
  const totalProperties = await Property.countDocuments({});
  const properties = await Property.find({}).skip(skip).limit(pageSize).lean();
  const showPagination = totalProperties > pageSize;

  return (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        {properties.length === 0 ? (
          <p>No Properties found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
        {showPagination && (
          <Pagination
            page={page}
            pageSize={pageSize}
            totalItems={totalProperties}
          />
        )}
      </div>
    </section>
  );
}

export default PropertiesPage;
