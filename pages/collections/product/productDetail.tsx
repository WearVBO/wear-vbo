import React from 'react'
import ProductDetail from "@/components/containers/Collections/ProductDetail"

interface ProductDetailProps {
    productId: string;
}

const productDetail = ({productId}: ProductDetailProps) => {
  // console.log("productId in page:", productId); // ← add this
  return (
    <div>
      <ProductDetail productId={productId} />
    </div>
  )
}

export default productDetail
