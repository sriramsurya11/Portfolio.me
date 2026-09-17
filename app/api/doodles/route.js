import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Doodle from "@/server/models/Doodle";
import { INITIAL_DOODLES } from "@/lib/initialDoodles";

// Global in-memory fallback store
let inMemoryDoodles = [...INITIAL_DOODLES];

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const dbDoodles = await Doodle.find({}).sort({ createdAt: -1 }).lean();
      // If DB has doodles, return them combined with initials
      if (dbDoodles && dbDoodles.length > 0) {
        return NextResponse.json({
          success: true,
          doodles: dbDoodles.map((d) => ({
            id: d._id.toString(),
            author: d.author,
            note: d.note,
            drawing: d.drawing,
            createdAt: d.createdAt,
          })),
        });
      }
    }

    return NextResponse.json({
      success: true,
      doodles: inMemoryDoodles,
    });
  } catch (error) {
    console.error("GET /api/doodles error:", error);
    return NextResponse.json({
      success: true,
      doodles: inMemoryDoodles,
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { author, note, drawing } = body;

    if (!author || !drawing) {
      return NextResponse.json(
        { success: false, error: "Author name and drawing are required." },
        { status: 400 }
      );
    }

    const newDoodleData = {
      id: "doodle-" + Date.now(),
      author: author.trim().substring(0, 30),
      note: (note || "").trim().substring(0, 40),
      drawing,
      createdAt: new Date().toISOString(),
    };

    const db = await connectToDatabase();
    if (db) {
      try {
        const savedDoc = await Doodle.create({
          author: newDoodleData.author,
          note: newDoodleData.note,
          drawing: newDoodleData.drawing,
        });
        return NextResponse.json({
          success: true,
          doodle: {
            id: savedDoc._id.toString(),
            author: savedDoc.author,
            note: savedDoc.note,
            drawing: savedDoc.drawing,
            createdAt: savedDoc.createdAt,
          },
        });
      } catch (dbErr) {
        console.warn("MongoDB save failed, using memory store:", dbErr.message);
      }
    }

    // Fallback store
    inMemoryDoodles.unshift(newDoodleData);

    return NextResponse.json({
      success: true,
      doodle: newDoodleData,
    });
  } catch (error) {
    console.error("POST /api/doodles error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process doodle." },
      { status: 500 }
    );
  }
}
