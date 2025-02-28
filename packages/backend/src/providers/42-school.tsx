import type { OAuthConfig, OAuthUserConfig } from "@sse-auth/types/provider";

export interface UserData {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  usual_full_name: null | string;
  usual_first_name: null | string;
  url: string;
  phone: "hidden" | string | null;
  displayname: string;
  image_url: string | null;
  "staff?": boolean;
  correction_point: number;
  pool_month: string | null;
  pool_year: string | null;
  location: string | null;
  wallet: number;
  anonymize_date: string;
  created_at: string;
  updated_at: string | null;
  alumni: boolean;
  "is_launched?": boolean;
}

export interface CursusUser {
  grade: string | null;
  level: number;
  skills: Array<{ id: number; name: string; level: number }>;
  blackholed_at: string | null;
  id: number;
  begin_at: string | null;
  end_at: string | null;
  cursus_id: number;
  has_coalition: boolean;
  created_at: string;
  updated_at: string | null;
  user: UserData;
  cursus: { id: number; created_at: string; name: string; slug: string };
}

export interface ProjectUser {
  id: number;
  occurrence: number;
  final_mark: number | null;
  status: "in_progress" | "finished";
  "validated?": boolean | null;
  current_team_id: number;
  project: {
    id: number;
    name: string;
    slug: string;
    parent_id: number | null;
  };
  cursus_ids: number[];
  marked_at: string | null;
  marked: boolean;
  retriable_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  tier: "none" | "easy" | "medium" | "hard" | "challenge";
  kind: "scolarity" | "project" | "pedagogy" | "scolarity";
  visible: boolean;
  image: string | null;
  nbr_of_success: number | null;
  users_url: string;
}

export interface LanguagesUser {
  id: number;
  language_id: number;
  user_id: number;
  position: number;
  created_at: string;
}

export interface TitlesUser {
  id: number;
  user_id: number;
  title_id: number;
  selected: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface ExpertisesUser {
  id: number;
  expertise_id: number;
  interested: boolean;
  value: number;
  contact_me: boolean;
  created_at: string;
  user_id: number;
}

export interface Campus {
  id: number;
  name: string;
  time_zone: string;
  language: {
    id: number;
    name: string;
    identifier: string;
    created_at: string;
    updated_at: string | null;
  };
  users_count: number;
  vogsphere_id: number;
  country: string;
  address: string;
  zip: string;
  city: string;
  website: string;
  facebook: string;
  twitter: string;
  active: boolean;
  email_extension: string;
  default_hidden_phone: boolean;
}

export interface CampusUser {
  id: number;
  user_id: number;
  campus_id: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface Image {
  link: string;
  versions: {
    micro: string;
    small: string;
    medium: string;
    large: string;
  };
}

export interface FortyTwoProfile extends UserData, Record<string, any> {
  groups: Array<{ id: string; name: string }>;
  cursus_users: CursusUser[];
  projects_users: ProjectUser[];
  languages_users: LanguagesUser[];
  achievements: Achievement[];
  titles: Array<{ id: string; name: string }>;
  titles_users: TitlesUser[];
  partnerships: any[];
  patroned: any[];
  patroning: any[];
  expertises_users: ExpertisesUser[];
  roles: Array<{ id: string; name: string }>;
  campus: Campus[];
  campus_users: CampusUser[];
  image: Image;
  user: any | null;
}

const School42Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 -200 960 960"
    className="-ml-1 size-3.5 fill-current dark:text-white"
  >
    <polygon points="32 412.6 362.1 412.6 362.1 578 526.8 578 526.8 279.1 197.3 279.1 526.8 -51.1 362.1 -51.1 32 279.1" />
    <polygon points="597.9 114.2 762.7 -51.1 597.9 -51.1" />
    <polygon points="762.7 114.2 597.9 279.1 597.9 443.9 762.7 443.9 762.7 279.1 928 114.2 928 -51.1 762.7 -51.1" />
    <polygon points="928 279.1 762.7 443.9 928 443.9" />
  </svg>
);

export default function FortyTwo<P extends FortyTwoProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "42-school",
    name: "42 School",
    type: "oauth",
    authorization: {
      url: "https://api.intra.42.fr/oauth/authorize",
      params: { scope: "public" },
    },
    token: "https://api.intra.42.fr/oauth/token",
    userinfo: "https://api.intra.42.fr/v2/me",
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.usual_full_name,
        email: profile.email,
        image: profile.image.link,
      };
    },
    style: {
      icon: <School42Icon />,
    },
    options,
  };
}

export { FortyTwo, School42Icon };
