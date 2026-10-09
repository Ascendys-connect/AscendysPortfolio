import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { companyService } from "@/services/company.service";
import type { CompanyInfo } from "@/types/content.types";

export interface SocialLinkItem {
  id: string;
  name: string;
  url: string;
  platform: "facebook" | "twitter" | "linkedin" | "instagram" | "youtube" | "tiktok" | "whatsapp" | string;
}

export interface CompanyContextType {
  company: CompanyInfo | null;
  isLoading: boolean;
  error: string | null;
  refreshCompany: () => Promise<void>;
  phones: string[];
  primaryPhone: string;
  email: string;
  emails: string[];
  address: string;
  city: string;
  country: string;
  fullAddress: string;
  socialLinks: SocialLinkItem[];
  whatsappNumber: string;
  whatsappUrl: string;
}

const defaultCompanyContext: CompanyContextType = {
  company: null,
  isLoading: true,
  error: null,
  refreshCompany: async () => {},
  phones: ["+228 96 49 82 82"],
  primaryPhone: "+228 96 49 82 82",
  email: "contact@ascendys-group.com",
  emails: ["contact@ascendys-group.com"],
  address: "Kpota colas",
  city: "Lomé",
  country: "Togo",
  fullAddress: "Kpota colas, Lomé, Togo",
  socialLinks: [],
  whatsappNumber: "+22896498282",
  whatsappUrl: "https://wa.me/22896498282",
};

const CompanyContext = createContext<CompanyContextType>(defaultCompanyContext);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompany = useCallback(async () => {
    try {
      const data = await companyService.get();
      if (data) {
        setCompany(data);
        setError(null);
      }
    } catch (err: any) {
      console.warn("Impossible de charger les informations de l'entreprise depuis l'API:", err);
      setError(err?.message || "Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const phones = useMemo(() => {
    if (!company) return defaultCompanyContext.phones;
    let list: string[] = [];
    if (Array.isArray(company.phones)) {
      list = company.phones.filter(Boolean);
    } else if (typeof company.phones === "string") {
      try {
        const parsed = JSON.parse(company.phones);
        if (Array.isArray(parsed)) list = parsed.filter(Boolean);
      } catch {
        list = (company.phones as string).split(",").map((p) => p.trim()).filter(Boolean);
      }
    }
    if (list.length === 0 && company.phone) {
      list = [company.phone];
    }
    return list.length > 0 ? list : defaultCompanyContext.phones;
  }, [company]);

  const primaryPhone = useMemo(() => {
    return phones[0] || company?.phone || defaultCompanyContext.primaryPhone;
  }, [phones, company]);

  const email = useMemo(() => {
    return company?.email || defaultCompanyContext.email;
  }, [company]);

  const emails = useMemo(() => {
    return email ? [email] : defaultCompanyContext.emails;
  }, [email]);

  const address = useMemo(() => company?.address || defaultCompanyContext.address, [company]);
  const city = useMemo(() => company?.city || defaultCompanyContext.city, [company]);
  const country = useMemo(() => company?.country || defaultCompanyContext.country, [company]);

  const fullAddress = useMemo(() => {
    const parts = [address, city, country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : defaultCompanyContext.fullAddress;
  }, [address, city, country]);

  const whatsappNumber = useMemo(() => {
    return (
      company?.whatsapp_number ||
      company?.social_links?.whatsapp ||
      company?.phone ||
      defaultCompanyContext.whatsappNumber
    );
  }, [company]);

  const whatsappUrl = useMemo(() => {
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent("Bonjour, je souhaite obtenir plus d'informations sur vos services.");
    return `https://wa.me/${cleanNumber}?text=${msg}`;
  }, [whatsappNumber]);

  const socialLinks = useMemo(() => {
    const links: SocialLinkItem[] = [];
    const socials = company?.social_links || {};

    const fb = company?.facebook_url || socials.facebook;
    if (fb && typeof fb === "string" && fb.trim()) {
      links.push({ id: "facebook", name: "Facebook", url: fb.trim(), platform: "facebook" });
    }

    const tw = company?.twitter_url || socials.twitter || socials.x;
    if (tw && typeof tw === "string" && tw.trim()) {
      links.push({ id: "twitter", name: "Twitter / X", url: tw.trim(), platform: "twitter" });
    }

    const li = company?.linkedin_url || socials.linkedin;
    if (li && typeof li === "string" && li.trim()) {
      links.push({ id: "linkedin", name: "LinkedIn", url: li.trim(), platform: "linkedin" });
    }

    const insta = company?.instagram_url || socials.instagram;
    if (insta && typeof insta === "string" && insta.trim()) {
      links.push({ id: "instagram", name: "Instagram", url: insta.trim(), platform: "instagram" });
    }

    const yt = company?.youtube_url || socials.youtube;
    if (yt && typeof yt === "string" && yt.trim()) {
      const isTikTok = yt.includes("tiktok.com");
      links.push({
        id: isTikTok ? "tiktok" : "youtube",
        name: isTikTok ? "TikTok" : "YouTube",
        url: yt.trim(),
        platform: isTikTok ? "tiktok" : "youtube",
      });
    }

    const wa = company?.whatsapp_number || socials.whatsapp;
    if (wa && typeof wa === "string" && wa.trim()) {
      const clean = wa.replace(/[^0-9]/g, "");
      const waLink = wa.startsWith("http") ? wa : `https://wa.me/${clean}`;
      links.push({ id: "whatsapp", name: "WhatsApp", url: waLink, platform: "whatsapp" });
    }

    // Capture any additional keys present in social_links
    Object.entries(socials).forEach(([key, val]) => {
      const lower = key.toLowerCase();
      if (
        !["facebook", "twitter", "x", "linkedin", "instagram", "youtube", "whatsapp"].includes(lower) &&
        typeof val === "string" &&
        val.trim()
      ) {
        links.push({
          id: lower,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          url: val.trim(),
          platform: lower,
        });
      }
    });

    return links;
  }, [company]);

  const value = useMemo(
    () => ({
      company,
      isLoading,
      error,
      refreshCompany: fetchCompany,
      phones,
      primaryPhone,
      email,
      emails,
      address,
      city,
      country,
      fullAddress,
      socialLinks,
      whatsappNumber,
      whatsappUrl,
    }),
    [
      company,
      isLoading,
      error,
      fetchCompany,
      phones,
      primaryPhone,
      email,
      emails,
      address,
      city,
      country,
      fullAddress,
      socialLinks,
      whatsappNumber,
      whatsappUrl,
    ]
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}
