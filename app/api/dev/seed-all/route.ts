// app/api/dev/seed-all/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import UserModel, { IUser } from "@/app/models/User";
import PackageModel, { IPackage } from "@/app/models/Package";
import BookingModel from "@/app/models/Booking";
import ReviewModel from "@/app/models/Review";
import mongoose from "mongoose";

async function seedUsers(): Promise<IUser[]> {
  const usersToSeed = [
    {
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      status: "approved",
    },
    {
      name: "Wanderlust Tours",
      email: "organizer1@example.com",
      role: "organizer",
      status: "approved",
    },
    {
      name: "Adventure Co.",
      email: "organizer2@example.com",
      role: "organizer",
      status: "approved",
    },
    {
      name: "Nomad Travels",
      email: "organizer3@example.com",
      role: "organizer",
      status: "pending",
    },
    {
      name: "Alice Wonderland",
      email: "alice@example.com",
      role: "customer",
      status: "approved",
    },
    {
      name: "Bob The Builder",
      email: "bob@example.com",
      role: "customer",
      status: "approved",
    },
    {
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "customer",
      status: "pending",
    },
  ];

  const existingUsers = await UserModel.find({
    email: { $in: usersToSeed.map((u) => u.email) },
  });
  const existingEmails = existingUsers.map((u) => u.email);
  const newUsersData = usersToSeed.filter(
    (u) => !existingEmails.includes(u.email),
  );

  let createdUsers: IUser[] = [...existingUsers];
  if (newUsersData.length > 0) {
    const inserted = await UserModel.insertMany(newUsersData);
    createdUsers = [...createdUsers, ...inserted];
    console.log(`${inserted.length} new users seeded.`);
  } else {
    console.log("All seed users already exist or no new users to seed.");
  }
  return createdUsers;
}

async function seedPackages(organizers: IUser[]): Promise<IPackage[]> {
  const approvedOrganizers = organizers.filter(
    (org) => org.role === "organizer" && org.status === "approved",
  );
  if (approvedOrganizers.length < 2) {
    console.log("Not enough approved organizers to seed diverse packages.");
    return [];
  }

  const packagesToSeed = [
    {
      name: "Mystical Bali Escape",
      description:
        "Discover the spiritual heart of Bali, from lush rice paddies to ancient temples. Includes yoga retreats and cultural workshops.",
      destination: "Bali, Indonesia",
      duration: 7,
      price: 1299.99,
      organizerId: approvedOrganizers[0]._id, // Use ID of first approved organizer
      status: "approved",
      imageUrl:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmFsaXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
      name: "Parisian Romance Getaway",
      description:
        "Experience the magic of Paris with guided tours of iconic landmarks, Seine river cruise, and charming Montmartre exploration.",
      destination: "Paris, France",
      duration: 5,
      price: 999.0,
      organizerId: approvedOrganizers[1]._id, // Use ID of second approved organizer
      status: "approved",
      imageUrl:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFyaXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
      name: "Tokyo Tech & Tradition",
      description:
        "Explore the vibrant contrast of Tokyo, from futuristic skyscrapers and tech hubs to serene gardens and historic shrines.",
      destination: "Tokyo, Japan",
      duration: 8,
      price: 1850.5,
      organizerId: approvedOrganizers[0]._id,
      status: "pending", // This one is pending admin approval
      imageUrl:
        "https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG9reW98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
    },
    {
      name: "Safari Adventure in Kenya",
      description:
        "Witness the Great Migration and spot the Big Five on an unforgettable safari journey through Kenya's national parks.",
      destination: "Masai Mara, Kenya",
      duration: 10,
      price: 2500.0,
      organizerId: approvedOrganizers[1]._id,
      status: "approved",
      imageUrl:
        "https://images.unsplash.com/photo-1534996380417-UR5505803987?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2FmYXJpfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    },
  ];

  // Avoid duplicating packages by name and organizer
  const createdPackages: IPackage[] = [];
  for (const pkgData of packagesToSeed) {
    const existingPackage = await PackageModel.findOne({
      name: pkgData.name,
      organizerId: pkgData.organizerId,
    });
    if (!existingPackage) {
      const newPkg = await PackageModel.create(pkgData);
      createdPackages.push(newPkg);
    } else {
      createdPackages.push(existingPackage); // Add existing to the list for booking/review seeding
    }
  }
  console.log(
    `${createdPackages.filter((p) => !packagesToSeed.find((ps) => ps.name === p.name && ps.organizerId.equals(p.organizerId))).length} new packages created. Others might have existed.`,
  ); // This logic needs refinement for accurate count of newly created
  return createdPackages;
}

async function seedBookingsAndReviews(users: IUser[], packages: IPackage[]) {
  const approvedCustomers = users.filter(
    (u) => u.role === "customer" && u.status === "approved",
  );
  const approvedPackages = packages.filter((p) => p.status === "approved");

  if (approvedCustomers.length < 2 || approvedPackages.length < 2) {
    console.log(
      "Not enough approved customers or packages to seed bookings/reviews.",
    );
    return;
  }

  const bookingsToSeed = [
    {
      packageId: approvedPackages[0]._id,
      userId: approvedCustomers[0]._id,
      numberOfTravelers: 2,
      totalPrice: approvedPackages[0].price * 2,
      paymentStatus: "paid",
    },
    {
      packageId: approvedPackages[1]._id,
      userId: approvedCustomers[1]._id,
      numberOfTravelers: 1,
      totalPrice: approvedPackages[1].price * 1,
      paymentStatus: "pending",
    },
    {
      // Another booking for the first customer, different package
      packageId: approvedPackages[1]._id, // Paris
      userId: approvedCustomers[0]._id, // Alice
      numberOfTravelers: 1,
      totalPrice: approvedPackages[1].price * 1,
      paymentStatus: "paid",
    },
  ];

  let createdBookingsCount = 0;
  for (const bookingData of bookingsToSeed) {
    // Simple check: avoid duplicate booking for same user & package
    const existingBooking = await BookingModel.findOne({
      userId: bookingData.userId,
      packageId: bookingData.packageId,
    });
    if (!existingBooking) {
      await BookingModel.create(bookingData);
      createdBookingsCount++;
    }
  }
  console.log(`${createdBookingsCount} new bookings seeded.`);

  // Seed reviews for paid bookings
  const paidBookings = await BookingModel.find({ paymentStatus: "paid" })
    .populate("packageId")
    .populate("userId");
  if (paidBookings.length > 0) {
    const reviewsToSeed = [
      {
        packageId: paidBookings[0].packageId, // Bali
        userId: paidBookings[0].userId, // Alice
        rating: 5,
        comment:
          "Absolutely breathtaking! The yoga sessions were incredible, and the culture is so rich. Highly recommend!",
      },
    ];
    if (
      paidBookings.length > 1 &&
      paidBookings[0].userId.toString() !== paidBookings[1].userId.toString()
    ) {
      // if second booking is by different user
      reviewsToSeed.push({
        packageId: paidBookings[1].packageId, //
        userId: paidBookings[1].userId, //
        rating: 4,
        comment:
          "Paris was lovely, but the hotel was a bit far from the center. Overall a good trip.",
      });
    }

    let createdReviewsCount = 0;
    for (const reviewData of reviewsToSeed) {
      // Avoid duplicate review by same user for same package
      const existingReview = await ReviewModel.findOne({
        userId: reviewData.userId,
        packageId: reviewData.packageId,
      });
      if (!existingReview) {
        await ReviewModel.create(reviewData);
        createdReviewsCount++;
      }
    }
    console.log(`${createdReviewsCount} new reviews seeded.`);
  }
}

export async function GET() {
  await dbConnect();
  try {
    // Optional: Clear existing data (Use with caution!)
    // console.log("Clearing existing data (optional)...");
    // await ReviewModel.deleteMany({});
    // await BookingModel.deleteMany({});
    // await PackageModel.deleteMany({});
    // await UserModel.deleteMany({}); // Be very careful with this in dev if you have manual entries you want to keep

    const seededUsers = await seedUsers();
    const seededPackages = await seedPackages(seededUsers);
    await seedBookingsAndReviews(seededUsers, seededPackages);

    return NextResponse.json(
      {
        message:
          "Database seeded successfully with users, packages, bookings, and reviews!",
        seededCounts: {
          users: seededUsers.length, // This is total users after seeding, not just newly created
          packages: seededPackages.length, // This is total packages considered for seeding
          // Add more precise counts if needed by refining seeder functions
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { message: "Error seeding database", error: error.message },
      { status: 500 },
    );
  }
}
