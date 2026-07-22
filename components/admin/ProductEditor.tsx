"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ArrowLeft, ImagePlus, Plus, X } from "lucide-react";
import {
  AdminButton,
  Card,
  ErrorState,
  PageHeader,
  formatMoney,
} from "@/components/admin/ui/AdminUI";
import { getApiErrorMessage } from "@/lib/apiClient";
import { ProductEditorSkeleton } from "@/components/containers/skeletons";
import { getSingleProduct } from "@/services/product.service";
import { getCategories } from "@/services/catalog.service";
import {
  MAX_IMAGES,
  createProduct,
  createVariant,
  updateProduct,
  updateVariant,
  validateImageFiles,
} from "@/services/admin.service";
import type { ProductVariant } from "@/lib/types";

type ProductForm = {
  productName: string;
  productDescription: string;
  productPrice: number;
  category: string;
  stock: number;
  isActive: string;
};

type VariantForm = {
  sku: string;
  size: string;
  color: string;
  price: number;
  stock: number;
};

const fieldClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black transition-colors";
const labelClass = "text-sm font-medium mb-1.5 block";

const ProductEditor = ({ productId }: { productId?: string }) => {
  const router = useRouter();
  const isEdit = Boolean(productId);
  const [savingVariant, setSavingVariant] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // object URLs must be revoked or the blobs leak for the page's lifetime
  const previews = useMemo(
    () => images.map((file) => URL.createObjectURL(file)),
    [images],
  );
  useEffect(
    () => () => previews.forEach((url) => URL.revokeObjectURL(url)),
    [previews],
  );

  const handleFilesSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []);
    if (picked.length === 0) return;

    const next = [...images, ...picked];
    const error = validateImageFiles(next);
    if (error) {
      setImageError(error);
    } else {
      setImageError("");
      setImages(next);
    }
    // reset so picking the same file again still fires onChange
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImageError("");
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const { data, isLoading, error, mutate } = useSWR(
    isEdit ? `/api/product/get-single-product/${productId}` : null,
    () => getSingleProduct(productId as string),
  );

  const { data: categories } = useSWR(
    "/api/category",
    async () => (await getCategories()).data,
    { revalidateOnFocus: false },
  );

  const product = data?.data?.product;
  const variants: ProductVariant[] = data?.data?.variants ?? [];
  const baseStock = data?.data?.stock ?? 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>({
    defaultValues: { isActive: "true", productPrice: 0, stock: 0 },
  });

  const variantForm = useForm<VariantForm>();

  useEffect(() => {
    if (!product) return;
    reset({
      productName: product.productName,
      productDescription: product.productDescription,
      productPrice: product.productPrice,
      category: product.category?._id || "",
      stock: baseStock,
      isActive: product.isActive ? "true" : "false",
    });
  }, [product, baseStock, reset]);

  const onSubmit = async (values: ProductForm) => {
    const payload = {
      productName: values.productName,
      productDescription: values.productDescription,
      productPrice: Number(values.productPrice),
      stock: Number(values.stock),
      isActive: values.isActive === "true",
      ...(values.category ? { category: values.category } : {}),
    };

    try {
      if (isEdit) {
        await updateProduct(productId as string, payload, images);
        toast.success("Product updated");
        setImages([]);
        mutate();
      } else {
        const response = await createProduct(payload, images);
        toast.success("Product created");
        router.push(`/admin/products/${response.data._id}`);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not save this product."));
    }
  };

  const onAddVariant = async (values: VariantForm) => {
    setSavingVariant(true);
    try {
      await createVariant(productId as string, {
        sku: values.sku,
        size: values.size,
        color: values.color,
        price: Number(values.price),
        stock: Number(values.stock),
      });
      toast.success("Variant added");
      variantForm.reset({ sku: "", size: "", color: "", price: 0, stock: 0 });
      mutate();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not add this variant."));
    } finally {
      setSavingVariant(false);
    }
  };

  const onVariantStockChange = async (variant: ProductVariant, stock: number) => {
    try {
      await updateVariant(variant._id, { stock });
      toast.success("Stock updated");
      mutate();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not update stock."));
    }
  };

  if (isEdit && isLoading) return <ProductEditorSkeleton />;

  if (isEdit && (error || !product))
    return (
      <ErrorState
        message={getApiErrorMessage(error, "This product could not be loaded.")}
        onRetry={() => mutate()}
      />
    );

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
      >
        <ArrowLeft size={16} /> Back to products
      </Link>

      <PageHeader
        title={isEdit ? "Edit product" : "New product"}
        subtitle={
          isEdit ? product?.productName : "Add a product to your catalog."
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* details form */}
        <Card className="lg:col-span-2 p-5 md:p-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div>
              <label className={labelClass} htmlFor="productName">
                Product name
              </label>
              <input
                id="productName"
                {...register("productName", {
                  required: "Product name is required",
                })}
                className={fieldClass}
                placeholder="Nike Air Max"
              />
              {errors.productName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.productName.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="productDescription">
                Description
              </label>
              <textarea
                id="productDescription"
                rows={5}
                {...register("productDescription", {
                  required: "Description is required",
                })}
                className={fieldClass}
                placeholder="Describe the product..."
              />
              {errors.productDescription && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.productDescription.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="productPrice">
                  Price (₦)
                </label>
                <input
                  id="productPrice"
                  type="number"
                  min={0}
                  {...register("productPrice", {
                    required: "Price is required",
                    min: { value: 0, message: "Price cannot be negative" },
                  })}
                  className={fieldClass}
                />
                {errors.productPrice && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.productPrice.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass} htmlFor="stock">
                  Base stock
                </label>
                <input
                  id="stock"
                  type="number"
                  min={0}
                  {...register("stock", {
                    min: { value: 0, message: "Stock cannot be negative" },
                  })}
                  className={fieldClass}
                />
                <p className="mt-1 text-xs text-gray-400">
                  Used when the product has no variants.
                </p>
              </div>

              <div>
                <label className={labelClass} htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  {...register("category")}
                  className={fieldClass}
                >
                  <option value="">No category</option>
                  {(categories || []).map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="isActive">
                  Status
                </label>
                <select
                  id="isActive"
                  {...register("isActive")}
                  className={fieldClass}
                >
                  <option value="true">Published</option>
                  <option value="false">Hidden</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <AdminButton type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : isEdit
                    ? "Save changes"
                    : "Create product"}
              </AdminButton>
              <Link href="/admin/products">
                <AdminButton type="button" variant="outline">
                  Cancel
                </AdminButton>
              </Link>
            </div>
          </form>
        </Card>

        {/* media */}
        <Card className="p-5 md:p-6 h-fit">
          <h2 className="font-semibold">Media</h2>
          <p className="mt-1 text-sm text-gray-500">
            PNG or JPG, up to 5MB each. Max {MAX_IMAGES} images.
          </p>

          {/* already uploaded */}
          {(product?.productImages?.length ?? 0) > 0 && (
            <>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-gray-400">
                Current
              </p>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {(product?.productImages || []).map((img) => (
                  <div
                    key={img._id}
                    className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                  >
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* staged for upload */}
          {images.length > 0 && (
            <>
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-gray-400">
                To upload ({images.length})
              </p>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {previews.map((src, index) => (
                  <div
                    key={src}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                  >
                    {/* object URL, so next/image optimisation doesn't apply */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={images[index]?.name || ""}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      aria-label={`Remove ${images[index]?.name}`}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* picker */}
          <label
            htmlFor="productImages"
            className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center transition-colors hover:border-black"
          >
            <ImagePlus size={22} className="text-gray-400" />
            <span className="text-sm font-medium">Add images</span>
            <span className="text-xs text-gray-400">
              Click to browse your files
            </span>
            <input
              id="productImages"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesSelected}
              className="sr-only"
            />
          </label>

          {imageError && (
            <p className="mt-2 text-xs text-red-500">{imageError}</p>
          )}

          {images.length > 0 && (
            <p className="mt-2 text-xs text-gray-500">
              Images upload when you save the product.
            </p>
          )}
        </Card>
      </div>

      {/* variants */}
      {isEdit && (
        <Card className="overflow-hidden">
          <div className="border-b border-gray-100 px-4 md:px-6 py-4">
            <h2 className="font-semibold">Variants</h2>
            <p className="mt-1 text-sm text-gray-500">
              Each variant carries its own price and stock.
            </p>
          </div>

          {variants.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {variants.map((variant) => (
                <div
                  key={variant._id}
                  className="flex flex-wrap items-center gap-3 px-4 md:px-6 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {[variant.size, variant.color]
                        .filter(Boolean)
                        .join(" / ") || variant.sku}
                    </p>
                    <p className="text-sm text-gray-500">SKU {variant.sku}</p>
                  </div>
                  <span className="font-medium">
                    {formatMoney(variant.price)}
                  </span>
                  <label className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Stock</span>
                    <input
                      type="number"
                      min={0}
                      defaultValue={variant.stock}
                      onBlur={(e) => {
                        const next = Number(e.target.value);
                        if (next !== variant.stock)
                          onVariantStockChange(variant, next);
                      }}
                      className="w-20 rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-black"
                    />
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-4 md:px-6 py-6 text-sm text-gray-500">
              No variants yet — this product uses its base price and stock.
            </p>
          )}

          {/* add variant */}
          <form
            onSubmit={variantForm.handleSubmit(onAddVariant)}
            className="grid grid-cols-2 gap-3 border-t border-gray-100 bg-gray-50/60 px-4 md:px-6 py-5 lg:grid-cols-6"
          >
            <input
              {...variantForm.register("sku", { required: true })}
              placeholder="SKU"
              className={fieldClass}
            />
            <input
              {...variantForm.register("size")}
              placeholder="Size"
              className={fieldClass}
            />
            <input
              {...variantForm.register("color")}
              placeholder="Color"
              className={fieldClass}
            />
            <input
              type="number"
              min={0}
              {...variantForm.register("price", { required: true })}
              placeholder="Price"
              className={fieldClass}
            />
            <input
              type="number"
              min={0}
              {...variantForm.register("stock", { required: true })}
              placeholder="Stock"
              className={fieldClass}
            />
            <AdminButton
              type="submit"
              disabled={savingVariant}
              className="col-span-2 lg:col-span-1"
            >
              <Plus size={16} /> Add
            </AdminButton>
          </form>
        </Card>
      )}
    </div>
  );
};

export default ProductEditor;
