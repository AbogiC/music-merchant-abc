import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

// MongoDB connection
let client
let db

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
    
    // Initialize with sample data if collections are empty
    const productsCollection = db.collection('products')
    const count = await productsCollection.countDocuments()
    
    if (count === 0) {
      await initializeSampleData()
    }
  }
  return db
}

async function initializeSampleData() {
  const sampleProducts = [
    // Sheet Music
    {
      id: uuidv4(),
      name: "Moonlight Sonata",
      description: "Beethoven's famous Piano Sonata No. 14 in C-sharp minor, complete score with fingering notations",
      price: 12.99,
      category: "sheet-music",
      type: "Classical Piano",
      composer: "Ludwig van Beethoven",
      difficulty: "Advanced",
      genre: "Classical",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
    },
    {
      id: uuidv4(),
      name: "The Real Book - Jazz Standards",
      description: "Essential collection of 400+ jazz standards with chord symbols and lyrics",
      price: 29.99,
      category: "sheet-music",
      type: "Jazz Collection",
      composer: "Various Artists",
      difficulty: "Intermediate",
      genre: "Jazz",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
    },
    {
      id: uuidv4(),
      name: "Canon in D",
      description: "Pachelbel's beautiful Canon arranged for piano solo with easy-to-read notation",
      price: 8.99,
      category: "sheet-music",
      type: "Classical Piano",
      composer: "Johann Pachelbel",
      difficulty: "Intermediate",
      genre: "Classical",
      image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop"
    },
    {
      id: uuidv4(),
      name: "Hotel California",
      description: "Complete guitar tablature and sheet music for The Eagles' classic rock anthem",
      price: 15.99,
      category: "sheet-music",
      type: "Rock Guitar",
      composer: "The Eagles",
      difficulty: "Intermediate",
      genre: "Rock",
      image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400&h=400&fit=crop"
    },
    {
      id: uuidv4(),
      name: "Bach Cello Suite No. 1",
      description: "Complete suite with bowings and fingerings, perfect for intermediate cellists",
      price: 18.99,
      category: "sheet-music",
      type: "Classical Cello",
      composer: "Johann Sebastian Bach",
      difficulty: "Intermediate",
      genre: "Classical",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
    },
    {
      id: uuidv4(),
      name: "Movie Themes Collection",
      description: "Popular movie themes arranged for piano, including Star Wars, Harry Potter, and more",
      price: 22.99,
      category: "sheet-music",
      type: "Piano Collection",
      composer: "Various Composers",
      difficulty: "Beginner",
      genre: "Film Music",
      image: "https://images.unsplash.com/photo-1489599735734-79b4d936543b?w=400&h=400&fit=crop"
    },

    // Instruments
    {
      id: uuidv4(),
      name: "Yamaha C40 Classical Guitar",
      description: "Full-size classical guitar with spruce top and meranti back, perfect for beginners and students",
      price: 149.99,
      category: "instruments",
      type: "Classical Guitar",
      brand: "Yamaha",
      model: "C40",
      image: "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=400&h=400&fit=crop"
    },
    {
      id: uuidv4(),
      name: "Steinway Model S Grand Piano",
      description: "Professional 6'2\" grand piano with rich, powerful tone and exceptional touch response",
      price: 89999.99,
      category: "instruments",
      type: "Grand Piano",
      brand: "Steinway & Sons",
      model: "Model S",
      image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop"
    },
    {
      id: uuidv4(),
      name: "Stradivarius Violin Copy",
      description: "Hand-crafted violin modeled after the famous Stradivarius, with ebony fittings and case",
      price: 1299.99,
      category: "instruments",
      type: "Violin",
      brand: "Master Craftsman",
      model: "Strad Copy",
      image: "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=400&h=400&fit=crop"
    },
    {
      id: uuidv4(),
      name: "Roland FP-30X Digital Piano",
      description: "88-key weighted digital piano with SuperNATURAL sound engine and Bluetooth connectivity",
      price: 699.99,
      category: "instruments",
      type: "Digital Piano",
      brand: "Roland",
      model: "FP-30X",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"
    },
    {
      id: uuidv4(),
      name: "Fender Player Stratocaster",
      description: "Classic electric guitar with alder body, maple neck, and three single-coil pickups",
      price: 849.99,
      category: "instruments",
      type: "Electric Guitar",
      brand: "Fender",
      model: "Player Stratocaster",
      image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400&h=400&fit=crop"
    },
    {
      id: uuidv4(),
      name: "Yamaha YAS-280 Alto Saxophone",
      description: "Student alto saxophone with gold lacquer finish, includes mouthpiece and case",
      price: 1199.99,
      category: "instruments",
      type: "Alto Saxophone",
      brand: "Yamaha",
      model: "YAS-280",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop"
    },

    // Accessories
    {
      id: uuidv4(),
      name: "Korg TM-50 Tuner Metronome",
      description: "Compact tuner and metronome combination with large LCD display and built-in microphone",
      price: 24.99,
      category: "accessories",
      type: "Tuner/Metronome",
      brand: "Korg",
      model: "TM-50",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
    },
    {
      id: uuidv4(),
      name: "Audio-Technica ATH-M50x Headphones",
      description: "Professional monitor headphones with exceptional clarity and deep, accurate bass response",
      price: 149.99,
      category: "accessories",
      type: "Studio Headphones",
      brand: "Audio-Technica",
      model: "ATH-M50x",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop"
    },
    {
      id: uuidv4(),
      name: "K&M Music Stand",
      description: "Professional height-adjustable music stand with perforated steel desk and tripod legs",
      price: 89.99,
      category: "accessories",
      type: "Music Stand",
      brand: "K&M",
      model: "10810",
      image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop"
    },
    {
      id: uuidv4(),
      name: "Yamaha Silent Practice Mute",
      description: "Trumpet practice mute that reduces volume by up to 20dB without affecting intonation",
      price: 45.99,
      category: "accessories",
      type: "Practice Mute",
      brand: "Yamaha",
      model: "Silent Brass",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop"
    },
    {
      id: uuidv4(),
      name: "SKB Guitar Hard Case",
      description: "Professional molded guitar case with plush interior and TSA-approved latches",
      price: 199.99,
      category: "accessories",
      type: "Guitar Case",
      brand: "SKB",
      model: "1SKB-6",
      image: "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=400&h=400&fit=crop"
    },
    {
      id: uuidv4(),
      name: "Shure SM58 Dynamic Microphone",
      description: "Industry-standard vocal microphone with legendary Shure quality and durability",
      price: 99.99,
      category: "accessories",
      type: "Microphone",
      brand: "Shure",
      model: "SM58",
      image: "https://images.unsplash.com/photo-1489599735734-79b4d936543b?w=400&h=400&fit=crop"
    }
  ]

  const productsCollection = db.collection('products')
  await productsCollection.insertMany(sampleProducts)
  console.log('Sample data initialized successfully')
}

// Products API
async function handleProducts(request, { params }) {
  const database = await connectToDatabase()
  const collection = database.collection('products')
  
  if (request.method === 'GET') {
    const products = await collection.find({}).toArray()
    return NextResponse.json(products)
  }
  
  if (request.method === 'POST') {
    const body = await request.json()
    const product = {
      id: uuidv4(),
      ...body,
      price: parseFloat(body.price)
    }
    
    await collection.insertOne(product)
    return NextResponse.json(product, { status: 201 })
  }
  
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

async function handleSingleProduct(request, { params }) {
  const database = await connectToDatabase()
  const collection = database.collection('products')
  const productId = params.path[1] // products/[id]
  
  if (request.method === 'PUT') {
    const body = await request.json()
    const updateData = {
      ...body,
      price: parseFloat(body.price)
    }
    
    await collection.updateOne(
      { id: productId },
      { $set: updateData }
    )
    
    const updatedProduct = await collection.findOne({ id: productId })
    return NextResponse.json(updatedProduct)
  }
  
  if (request.method === 'DELETE') {
    await collection.deleteOne({ id: productId })
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

// Main handler
export async function GET(request, { params }) {
  const path = params.path || []
  
  try {
    if (path.length === 0) {
      return NextResponse.json({ message: 'MusicMerchant API' })
    }
    
    if (path[0] === 'products') {
      if (path.length === 1) {
        return handleProducts(request, { params })
      } else if (path.length === 2) {
        return handleSingleProduct(request, { params })
      }
    }
    
    return NextResponse.json({ error: 'Route not found' }, { status: 404 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  const path = params.path || []
  
  try {
    if (path[0] === 'products') {
      return handleProducts(request, { params })
    }
    
    return NextResponse.json({ error: 'Route not found' }, { status: 404 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  const path = params.path || []
  
  try {
    if (path[0] === 'products' && path.length === 2) {
      return handleSingleProduct(request, { params })
    }
    
    return NextResponse.json({ error: 'Route not found' }, { status: 404 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const path = params.path || []
  
  try {
    if (path[0] === 'products' && path.length === 2) {
      return handleSingleProduct(request, { params })
    }
    
    return NextResponse.json({ error: 'Route not found' }, { status: 404 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}