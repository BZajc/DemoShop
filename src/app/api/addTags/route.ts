import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    // Hardcoded tags to add into DB
    const availableTags = [
      "#Photography", "#PhotoOfTheDay", "#InstaPhoto", "#PicOfTheDay", "#Camera", "#Photographer",
      "#PhotoArt", "#Portrait", "#Landscape", "#StreetPhotography", "#NaturePhotography",
      "#BlackAndWhite", "#TravelPhotography", "#VisualArt", "#PhotoLife", "#Shutterbug",

      "#Spring", "#Summer", "#Autumn", "#Winter", "#Nature", "#Mountains", "#Ocean", "#Sunset",
      "#Sunrise", "#Waterfall", "#Sky", "#Flowers", "#Trees", "#Woods", "#Jungle", "#Beach", "#Rain",
      "#Desert", "#Cave", "#Iceberg", "#NorthernLights", "#Foggy", "#Snow", "#Cloudy", "#Storm",

      "#Wildlife", "#Animals", "#Birds", "#Dogs", "#Cats", "#Horses", "#Fish", "#Reptiles", "#Insects",
      "#Butterfly", "#Parrots", "#Elephants", "#Lions", "#Tigers", "#Bears", "#Dolphins", "#Whales",

      "#PortraitPhotography", "#Selfie", "#Fashion", "#Style", "#Casual", "#StreetStyle",
      "#Fitness", "#Workout", "#Yoga", "#Meditation", "#Running", "#Dancing", "#Music",
      "#Travel", "#Backpacking", "#Hiking", "#Camping", "#Adventure", "#Roadtrip",

      "#Cityscape", "#Skyscraper", "#Urban", "#StreetArt", "#Buildings", "#Bridges",
      "#Monuments", "#Castles", "#Cathedrals", "#Ruins", "#Graffiti", "#NeonLights",
      "#Subway", "#Downtown", "#OldTown", "#NightCity", "#TownSquare", "#HistoricalSites",

      "#WorldExplorer", "#Globetrotter", "#InstaTravel", "#Tourism", "#Island", "#Boat",
      "#Cruise", "#Lighthouse", "#Countryside", "#Farmlife", "#Safari", "#JungleTrek",
      "#HiddenPlaces", "#CulturalHeritage", "#UnescoWorldHeritage", "#Horizon",

      "#Christmas", "#Halloween", "#NewYear", "#Easter", "#Thanksgiving", "#ValentinesDay",
      "#IndependenceDay", "#Carnival", "#MardiGras", "#Diwali", "#Hanukkah", "#Ramadan",
      "#Oktoberfest", "#Concert", "#Festival", "#Parade", "#Wedding", "#Birthday", "#Anniversary",

      "#FoodPhotography", "#Delicious", "#Yummy", "#Tasty", "#Breakfast", "#Brunch",
      "#Lunch", "#Dinner", "#Dessert", "#Cake", "#Chocolate", "#Cookies", "#Pizza",
      "#Burger", "#Sushi", "#Pasta", "#Tacos", "#Steak", "#BBQ", "#Cheese", "#Fruit",
      "#Vegetarian", "#Vegan", "#Smoothie", "#Coffee", "#Tea", "#Wine", "#Cocktail",
      "#Beer", "#Whiskey", "#IceCream", "#StreetFood", "#FoodTruck",

      "#Tech", "#Gadgets", "#Smartphone", "#Tablet", "#Laptop", "#PCBuild", "#Gaming",
      "#RetroGaming", "#Console", "#Headphones", "#WearableTech", "#VR", "#AI", "#Robotics",
      "#Futuristic", "#ElectricCar", "#Drones", "#Cameras", "#Lenses",

      "#Painting", "#Drawing", "#Sketch", "#Watercolor", "#Calligraphy", "#GraffitiArt",
      "#Tattoo", "#Illustration", "#GraphicDesign", "#Typography", "#AbstractArt",
      "#MinimalArt", "#Cubism", "#Surrealism", "#PhotographyArt", "#Colorful",

      "#Science", "#Space", "#NASA", "#Astrophotography", "#Astronomy", "#Moon",
      "#Stars", "#Galaxy", "#Nebula", "#Eclipse", "#Comet", "#Mars", "#SpaceTravel",
      "#Telescope", "#Physics", "#Biology", "#Chemistry",

      "#CarPhotography", "#SuperCars", "#Motorcycle", "#ClassicCars", "#Trucks",
      "#Formula1", "#MotoGP", "#Racing", "#Bicycle", "#Train", "#Metro", "#Airplane",
      "#Boats", "#Yachts", "#Helicopter", "#HotAirBalloon",

      "#Football", "#Soccer", "#Basketball", "#Tennis", "#Golf", "#Baseball",
      "#Hockey", "#Surfing", "#Skateboarding", "#Snowboarding", "#Skiing",
      "#RockClimbing", "#Bouldering", "#Diving", "#Paragliding",

      "#Books", "#Reading", "#Writing", "#Poetry", "#Journaling", "#Gardening",
      "#Knitting", "#DIY", "#Handmade", "#Woodwork", "#Calligraphy",
      "#Collectibles", "#BoardGames", "#Puzzles", "#Cooking", "#Baking",

      "#InteriorDesign", "#Minimalist", "#Scandinavian", "#BohoStyle",
      "#VintageHome", "#RusticDecor", "#IndustrialStyle", "#MidCenturyModern",
      "#Houseplants", "#CozyVibes", "#BedroomDecor", "#KitchenGoals",

      "#Love", "#Happiness", "#Motivation", "#Inspiration", "#PositiveVibes",
      "#Mindfulness", "#Peace", "#Dreams", "#Hope", "#Freedom", "#Creativity",
      "#SelfCare", "#PersonalGrowth", "#Confidence", "#Kindness",

      "#Makeup", "#Skincare", "#NailArt", "#Hairstyle", "#FashionBlogger",
      "#OOTD", "#StreetStyle", "#CasualLook", "#LuxuryFashion", "#Jewelry",

      "#Memes", "#FunnyMoments", "#TrendingNow", "#LifeHacks", "#Unboxing",
      "#BehindTheScenes", "#Throwback", "#DailyRoutine", "#Influencer",
      "#SocialMedia",

      "#EcoFriendly", "#SustainableLiving", "#ClimateChange", "#ZeroWaste",
      "#Recycling", "#Upcycling", "#PlantBased", "#SolarPower", "#GreenEnergy",
      "#WildlifeConservation", "#EarthDay", "#VeganLife",

      "#Mystery", "#UrbanLegends", "#History", "#Archaeology", "#Antiques",
      "#Steampunk", "#Cyberpunk", "#Fantasy", "#SciFi", "#TimeTravel",
      "#Retro", "#Nostalgia", "#80s", "#90s", "#StreetCulture",
    ];
    
    // Save tags in DB
    await Promise.all(
      availableTags.map(async (tag) => {
        await prisma.tag.upsert({
          where: { name: tag },
          update: {},
          create: { name: tag },
        });
      })
    );

    return NextResponse.json({ success: true, message: "Tags added to the database!" });
  } catch (error) {
    console.error("Error adding tags:", error);
    return NextResponse.json({ success: false, error: "Failed to add tags" });
  }
}
