import { useEffect, useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

type PokemonTeam = string[];

const teams: PokemonTeam[] = [
  ["Gastrodon", "Calyrex-Shadow", "Rillaboom", "Incineroar", "Thundurus", "Zacian"], // 2022 VGC World Champion Team
  ["Landorus", "Urshifu", "Flutter Mane", "Chien-Pao", "Amoonguss", "Arcanine"], // 2023 VGC World Champion Team
  ["Miraidon", "Ogerpon", "Urshifu", "Iron Hands", "Whimsicott", "Farigiraf"], // 2024 VGC World Champion Team
  ["Dragonite", "Landorus", "Volcanion", "Weavile", "Magnezone", "Tapu Lele"], // 2022 Smogen World Champion Team
  ["Samurott-Hisui", "Ceruledge", "Skeledirge", "Pawmot", "Garchomp", "Scizor"], // 2023 Smogen World Champion Team
  ["Samurott-Hisui", "Landorus-Therian", "Kingambit", "Darkrai", "Zamazenta", "Glimmora"], //Team US Midwest – kythr’s Finals Team
];

// ✅ Map display names to showdown sprite format
const showdownNameMap: Record<string, string> = {
  "calyrex-shadow": "calyrex-shadow",
  "zacian-crowned": "zacian-crowned",
  "zamazenta-crowned": "zamazenta-crowned",
  "urshifu-rapid-strike": "urshifu-rapid-strike",
  "flutter mane": "fluttermane",
  "chien-pao": "chienpao",
  "samurott-hisui": "samurott-hisui", 
  "landorus-therian": "landorus-therian",
};

const formatName = (name: string): string => {
  const normalized = name.toLowerCase().trim();
  return showdownNameMap[normalized] || normalized.replace(/[^a-z0-9]/g, '');
};

const getSpriteUrl = (name: string): string =>
  `https://play.pokemonshowdown.com/sprites/gen5/${formatName(name)}.png`;

export default function TeamCarousel() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const max = teams.length - 1;

  // ✅ Preload images
  useEffect(() => {
    const allPokemon = new Set(teams.flat());
    allPokemon.forEach((name) => {
      const img = new Image();
      img.src = getSpriteUrl(name);
    });
  }, []);

  // ✅ Smooth transition handler
  const changeTeam = (newIndex: number) => {
    setFade(false); // fade out
    setTimeout(() => {
      setIndex(newIndex); // switch team
      setFade(true); // fade in
    }, 150); // match transition duration
  };

  return (
    <Box sx={{ textAlign: 'center', color: 'white', mt: 4 }}>
      {/* Team Display with Fade Transition */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          mb: 2,
          flexWrap: 'wrap',
          opacity: fade ? 1 : 0,
          transition: 'opacity 150ms ease-in-out',
        }}
      >
        {teams[index].map((name) => (
          <Box key={name} sx={{ textAlign: 'center' }}>
            <img
              src={getSpriteUrl(name)}
              alt={name}
              style={{ maxHeight: '60px', height: 'auto', width: 'auto' }}
            />
            <div style={{ fontSize: '0.75rem', marginTop: 4 }}>{name}</div>
          </Box>
        ))}
      </Box>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => changeTeam(index - 1)} disabled={index === 0} color="primary">
          <ArrowBackIos />
        </IconButton>

        {teams.map((_, i) => (
          <Button
            key={i}
            onClick={() => changeTeam(i)}
            sx={{
              minWidth: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: i === index ? 'white' : 'gray',
              '&:hover': {
                backgroundColor: 'lightgray',
              },
            }}
          />
        ))}

        <IconButton onClick={() => changeTeam(index + 1)} disabled={index === max} color="primary">
          <ArrowForwardIos />
        </IconButton>
      </Box>
    </Box>
  );
}
