"use client";

import React from 'react'
import {ProductDetailComponent} from "@/exports/exports"

export default function Page ({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = React.use(params);
    console.log("productId from params:", productId); // ← add this
  
  return (
    <div>
      <ProductDetailComponent productId={productId} />
    </div>
  )

}

// export default page
