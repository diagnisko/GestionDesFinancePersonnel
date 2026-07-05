import { useEffect, useMemo, useState, type ReactElement } from 'react';
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  LoaderCircle,
  MapPin,
  Sun,
  Wind,
} from 'lucide-react';

interface WeatherResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: ReactElement;
  city: string;
}

const defaultLocation = { lat: 14.6928, lon: -17.4467, city: 'Dakar' };

function weatherDescription(code: number) {
  switch (code) {
    case 0:
      return 'Ciel dégagé';
    case 1:
    case 2:
      return 'Partiellement nuageux';
    case 3:
      return 'Couvert';
    case 45:
    case 48:
      return 'Brouillard';
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return 'Bruine';
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return 'Pluie';
    case 71:
    case 73:
    case 75:
    case 77:
      return 'Neige';
    case 80:
    case 81:
    case 82:
      return 'Averses';
    case 95:
    case 96:
    case 99:
      return 'Orage';
    default:
      return 'Météo variée';
  }
}

function weatherIcon(code: number) {
  switch (code) {
    case 0:
      return <Sun size={22} className="text-brass" />;
    case 1:
    case 2:
      return <CloudSun size={22} className="text-info" />;
    case 3:
      return <Cloud size={22} className="text-paper-dim" />;
    case 45:
    case 48:
      return <CloudFog size={22} className="text-paper-dim" />;
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return <CloudRain size={22} className="text-info" />;
    case 71:
    case 73:
    case 75:
    case 77:
      return <CloudSnow size={22} className="text-paper" />;
    case 95:
    case 96:
    case 99:
      return <CloudLightning size={22} className="text-loss" />;
    default:
      return <CloudSun size={22} className="text-info" />;
  }
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      setLoading(true);
      try {
        const location = await new Promise<{ lat: number; lon: number; city: string }>((resolve) => {
          if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => resolve({ lat: position.coords.latitude, lon: position.coords.longitude, city: 'Votre position' }),
              () => resolve(defaultLocation),
            );
            return;
          }

          resolve(defaultLocation);
        });

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
        const response = await fetch(url);
        const data = (await response.json()) as WeatherResponse;

        if (!cancelled) {
          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            windSpeed: Math.round(data.current.wind_speed_10m),
            description: weatherDescription(data.current.weather_code),
            icon: weatherIcon(data.current.weather_code),
            city: location.city,
          });
        }
      } catch {
        if (!cancelled) {
          setWeather({
            temperature: 24,
            humidity: 63,
            windSpeed: 12,
            description: 'Ciel doux',
            icon: <Sun size={22} className="text-brass" />,
            city: defaultLocation.city,
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadWeather();

    return () => {
      cancelled = true;
    };
  }, []);

  const summary = useMemo(() => {
    if (!weather) {
      return 'Chargement de la météo...';
    }

    return `${weather.description} · ${weather.temperature}°C`;
  }, [weather]);

  return (
    <div className="panel relative overflow-hidden p-5 sm:p-6 animate-rise stagger-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(200,155,74,0.18),_transparent_55%)]" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-paper-dim">Météo du moment</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-850 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
              {loading ? <LoaderCircle className="animate-spin text-brass" size={22} /> : weather?.icon}
            </div>
            <div>
              <p className="font-display text-2xl text-paper">
                {loading ? '—' : `${weather?.temperature ?? 0}°C`}
              </p>
              <p className="text-sm text-paper-dim">{loading ? 'Chargement…' : summary}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-ink-border bg-ink-850/80 px-3 py-2 text-right">
          <div className="flex items-center gap-1.5 text-xs text-paper-dim">
            <MapPin size={13} />
            <span>{loading ? 'Localisation' : weather?.city}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-paper">
            <Wind size={14} className="text-info" />
            <span>{loading ? '--' : `${weather?.windSpeed ?? 0} km/h`}</span>
          </div>
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap gap-3 text-sm text-paper-dim">
        <span className="rounded-full bg-ink-850 px-3 py-1">Humidité {loading ? '--' : `${weather?.humidity ?? 0}%`}</span>
        <span className="rounded-full bg-ink-850 px-3 py-1">Conseil : {loading ? 'Préparation' : (weather?.temperature && weather.temperature > 28 ? 'Rafraîchissez vos dépenses de confort' : 'Une journée idéale pour garder le cap')}</span>
      </div>
    </div>
  );
}
