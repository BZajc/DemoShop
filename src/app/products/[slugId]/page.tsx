import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { gql } from "@apollo/client";
import { client } from "@/lib/apollo-client";
import { Button } from "@/components/ui/button";
import ProductOptions from "@/components/singleProduct/ProductOptions";
import { ShoppingCart } from "lucide-react";
import ImageCarousel from "@/components/singleProduct/ImageCarousel";

type ProductData = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  displayImage?: string;
  stock: number;
  category?: { name: string; slug: string };
  options: Array<{ optionKey: string; optionValue: string }>;
  images: Array<{ url: string; displayOrder: number }>;
  specifications: Array<{ label: string; value: string }>;
  guarantee: Array<{ type: string; count: number; unit: string }>;
  faqs: Array<{ question: string; answer: string; sortOrder: number }>;
};

type Params = { slugId: string };

const PRODUCT_QUERY = gql`
  query Product($id: Int!) {
    product(id: $id) {
      id
      name
      slug
      description
      price
      stock
      category {
        name
        slug
      }
      options {
        optionKey
        optionValue
      }
      images {
        url
        displayOrder
      }
      specifications {
        label
        value
      }
      guarantee {
        type
        count
        unit
      }
      faqs {
        question
        answer
        sortOrder
      }
    }
  }
`;

const RELATED_QUERY = gql`
  query Related($category: [String!]) {
    allProducts(take: 4, skip: 0, category: $category) {
      id
      name
      slug
      price
      displayImage
    }
  }
`;

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slugId } = await params;
  const [slug, idPart] = slugId.split(/-(?=[^-]+$)/);
  const id = parseInt(idPart, 10);

  // fetch main product
  const { data } = await client.query<{ product: ProductData }>({
    query: PRODUCT_QUERY,
    variables: { id },
    fetchPolicy: "no-cache",
  });
  const product = data.product;
  if (!product || product.slug !== slug) return notFound();

  // group options
  const groupedOptions = product.options.reduce<Record<string, string[]>>(
    (acc, { optionKey, optionValue }) => {
      acc[optionKey] = acc[optionKey] || [];
      if (!acc[optionKey].includes(optionValue)) {
        acc[optionKey].push(optionValue);
      }
      return acc;
    },
    {}
  );

  // fetch related
  const { data: rd } = await client.query<{ allProducts: ProductData[] }>({
    query: RELATED_QUERY,
    variables: {
      category: product.category ? [product.category.slug] : [],
    },
    fetchPolicy: "no-cache",
  });
  const related = rd.allProducts.filter((p) => p.id !== id);

  // sort gallery images
  const gallery = [...product.images]
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((img) => img.url);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 mt-16 space-y-16">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500">
        <Link href="/">Home</Link> / <Link href="/products">Products</Link> /{" "}
        <span className="text-gray-700 dark:text-white">{product.name}</span>
      </nav>

      {/* Carousel + Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* use your existing ImageCarousel */}
        <ImageCarousel images={gallery} />

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold dark:text-white">
            {product.name}
          </h1>
          {product.description && (
            <p className="text-gray-700 dark:text-gray-300">
              {product.description}
            </p>
          )}
          <div className="mt-4 text-2xl font-bold dark:text-white">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "EUR",
            }).format(product.price)}
          </div>
          {product.category && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Category:{" "}
              <span className="font-medium">{product.category.name}</span>
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            In stock: <span className="font-medium">{product.stock}</span>
          </p>

          {/* Quantity */}
          <div className="mt-4">
            <label className="block text-sm font-medium dark:text-gray-300">
              Quantity
            </label>
            <input
              type="number"
              defaultValue={1}
              min={1}
              max={product.stock}
              className="mt-1 w-20 border rounded px-2 py-1"
            />
          </div>

          {/* Dynamic Options */}
          <ProductOptions options={groupedOptions} />

          <Button className="w-full mt-6">
            Add to Cart <ShoppingCart />
          </Button>
        </div>
      </div>

      {/* Related Products */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
        {related.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}-${p.id}`}
                className="block p-4 rounded bg-white dark:bg-zinc-900 shadow hover:shadow-md transition"
              >
                <div className="relative w-full h-32 mb-2">
                  <Image
                    src={p.displayImage ?? gallery[0]}
                    alt={p.name}
                    fill
                    className="object-cover rounded"
                    sizes="100px"
                  />
                </div>
                <p className="text-sm font-medium dark:text-white line-clamp-2">
                  {p.name}
                </p>
                <p className="text-sm dark:text-gray-400 mt-1">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "EUR",
                  }).format(p.price)}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No related products found.</p>
        )}
      </section>

      {/* Specifications */}
      {product.specifications.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-2">Specifications</h2>
          <ul className="list-disc list-inside text-gray-500">
            {product.specifications.map((spec, i) => (
              <li key={i}>
                <strong>{spec.label}:</strong> {spec.value}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQ */}
      {product.faqs.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-2">FAQ</h2>
          {product.faqs
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((item, i) => (
              <div key={i} className="mb-4">
                <p className="font-medium dark:text-white">
                  Q: {item.question}
                </p>
                <p className="text-gray-500">A: {item.answer}</p>
              </div>
            ))}
        </section>
      )}

      {/* Guarantee */}
      {product.guarantee.length > 0 && (
        <section className="py-6 bg-gray-50 dark:bg-zinc-900 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">
            Guarantee & Returns
          </h2>
          <div className="flex flex-wrap gap-3">
            {product.guarantee.map((g, i) => (
              <div
                key={i}
                className="flex items-center space-x-2 bg-gray-200 dark:bg-zinc-800 rounded-full px-4 py-2"
              >
                <span className="font-medium dark:text-white">{g.type}</span>
                <span className="text-gray-600 dark:text-gray-400">|</span>
                <span className="dark:text-white">
                  {g.count} {g.unit}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Share Buttons */}
      <section className="flex space-x-4">
        <Button variant="outline" size="sm">
          Share Facebook
        </Button>
        <Button variant="outline" size="sm">
          Share Twitter
        </Button>
        <Button variant="outline" size="sm">
          Share Pinterest
        </Button>
      </section>
    </div>
  );
}
