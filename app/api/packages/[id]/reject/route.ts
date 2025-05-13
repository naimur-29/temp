// app/api/packages/[id]/reject/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import PackageModel from "@/app/models/Package";
import mongoose from "mongoose";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await dbConnect();
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid package ID" },
      { status: 400 },
    );
  }

  try {
    const updatedPackage = await PackageModel.findByIdAndUpdate(
      id,
      { status: "rejected" },
      { new: true },
    );

    if (!updatedPackage) {
      return NextResponse.json(
        { message: "Package not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedPackage, { status: 200 });
  } catch (error: any) {
    console.error("Error rejecting package:", error);
    return NextResponse.json(
      { message: "Error rejecting package", error: error.message },
      { status: 500 },
    );
  }
}
