export const getCategoryHeroImage = (categoryName = '') => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('laptop') || name.includes('computer')) {
    return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop';
  }
  
  if (name.includes('audio') || name.includes('headphone') || name.includes('speaker') || name.includes('premium speakers')) {
    if (name.includes('speaker')) {
       return 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=2070&auto=format&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop';
  }
  
  if (name.includes('home cinema') || name.includes('tv') || name.includes('cinema')) {
    return 'https://images.unsplash.com/photo-1593784991095-a205039470b6?q=80&w=2070&auto=format&fit=crop';
  }
  
  if (name.includes('refrigerator') || name.includes('fridge') || name.includes('modern refrigerators')) {
    return 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop';
  }
  
  if (name.includes('smartphone') || name.includes('phone') || name.includes('mobile') || name.includes('tablet')) {
    return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1760&auto=format&fit=crop';
  }

  if (name.includes('featured') || name.includes('collection')) {
    return 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop';
  }

  if (name.includes('sale') || name.includes('deal')) {
    return 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop';
  }

  if (name.includes('new') || name.includes('arrival')) {
    return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop';
  }
  
  // Default abstract premium tech background
  return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop';
};

export const getCategoryTagline = (categoryName = '') => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('laptop')) return 'PRO-LEVEL PERFORMANCE FOR EVERY TASK';
  if (name.includes('audio')) return 'IMMERSIVE SOUNDSCAPES FOR THE AUDIOPHILE';
  if (name.includes('home cinema')) return 'TRANSFORM YOUR LIVING ROOM INTO A THEATER';
  if (name.includes('speaker')) return 'POWERFUL AUDIO THAT MOVES THE SOUL';
  if (name.includes('refrigerator')) return 'NEXT-GEN COOLING FOR THE MODERN HOME';
  if (name.includes('smartphone')) return 'STAY CONNECTED WITH CUTTING-EDGE TECH';
  if (name.includes('sale')) return 'EXCLUSIVE OFFERS ON PREMIUM ELECTRONICS';
  if (name.includes('new')) return 'THE LATEST INNOVATIONS, FRESHLY UNBOXED';
  
  return 'DISCOVER THE FUTURE OF ELECTRONICS';
};
