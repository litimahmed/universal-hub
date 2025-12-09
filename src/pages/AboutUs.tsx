import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Target, Eye, Award, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/TranslationContext";
import { useAboutUs } from "@/hooks/useAboutUs";
import { useContactInfo } from "@/hooks/useContactInfo";

const AboutUs = () => {
    const { t, language } = useTranslation();
    const { data: apiData, isLoading } = useAboutUs();
    const { data: contactData } = useContactInfo();

    const getTranslatedValue = (field?: { lang: string; value: string }[]) => {
        if (!field) return '';
        const translation = field.find(t => t.lang === language);
        return translation ? translation.value : (field.find(t => t.lang === 'en')?.value || '');
    };

    const getContactTranslation = (field?: { fr: string; ar: string; en: string }) => {
        if (!field) return '';
        return field[language as 'en' | 'fr' | 'ar'] || field.en || field.fr || '';
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <Link to="/">
                        <Button variant="ghost" className="mb-8">
                            <ArrowLeft className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                            {t('aboutPage.backToHome')}
                        </Button>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            {getTranslatedValue(apiData?.titre) || t('aboutPage.title')}
                        </h1>

                        <div className="space-y-12">
                            {/* Show API content if available, otherwise show fallback */}
                            {apiData?.contenu ? (
                                <section>
                                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {getTranslatedValue(apiData.contenu)}
                                    </p>
                                </section>
                            ) : !apiData && (
                                <section>
                                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                                        Toorrii est une plateforme innovante de gestion de files d'attente qui transforme l'expérience d'attente pour les entreprises et leurs clients. Notre solution permet une gestion intelligente et efficace des flux de visiteurs.
                                    </p>
                                </section>
                            )}

                            {/* Mission Section */}
                            <section>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 rounded-lg bg-primary/10">
                                        <Target className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-3">{t('aboutPage.missionTitle')}</h2>
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                            {apiData?.mission ? getTranslatedValue(apiData.mission) : "Simplifier et optimiser la gestion des files d'attente pour améliorer l'expérience client et l'efficacité opérationnelle des entreprises."}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Vision Section */}
                            <section>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 rounded-lg bg-primary/10">
                                        <Eye className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-3">{t('aboutPage.visionTitle')}</h2>
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                            {apiData?.vision ? getTranslatedValue(apiData.vision) : "Devenir la référence mondiale en matière de solutions de gestion de files d'attente intelligentes et accessibles."}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Values Section */}
                            <section>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 rounded-lg bg-primary/10">
                                        <Award className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-3">{t('aboutPage.valuesTitle')}</h2>
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                            {apiData?.valeurs ? getTranslatedValue(apiData.valeurs) : "Innovation, Excellence, Satisfaction client, Transparence et Engagement envers nos partenaires."}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Who We Serve Section */}
                            <section>
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 rounded-lg bg-primary/10">
                                        <Users className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-3">{t('aboutPage.whoWeServeTitle')}</h2>
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                            {apiData?.qui_nous_servons ? getTranslatedValue(apiData.qui_nous_servons) : "Entreprises, administrations, hôpitaux, banques et tout établissement souhaitant optimiser la gestion de leurs visiteurs."}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Why Choose Us Section */}
                            <section className="pt-8 border-t border-border">
                                <h2 className="text-2xl font-semibold mb-4">{t('aboutPage.whyChooseTitle')}</h2>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {apiData?.pourquoi_choisir_nous ? getTranslatedValue(apiData.pourquoi_choisir_nous) : "Une solution fiable, intuitive et personnalisable qui s'adapte à vos besoins spécifiques avec un support technique dédié."}
                                </p>
                            </section>

                            <section className="pt-8 border-t border-border">
                                <h2 className="text-2xl font-semibold mb-4">{t('aboutPage.getInTouchTitle')}</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    {getContactTranslation(contactData?.message_acceuil) || t('aboutPage.getInTouchText')}
                                </p>
                                <div className="space-y-2 text-muted-foreground">
                                    {contactData?.email && <p>Email : {contactData.email}</p>}
                                    {contactData?.telephone_1 && <p>Téléphone 1 : {contactData.telephone_1}</p>}
                                    {contactData?.telephone_2 && <p>Téléphone 2 : {contactData.telephone_2}</p>}
                                    {contactData?.telephone_fixe && <p>Fax : {contactData.telephone_fixe}</p>}
                                    {contactData?.adresse && <p>Adresse : {getContactTranslation(contactData.adresse)}</p>}
                                    {!contactData && (
                                        <>
                                            <p>{t('aboutPage.email')}</p>
                                            <p>{t('aboutPage.phone')}</p>
                                            <p>{t('aboutPage.address')}</p>
                                        </>
                                    )}
                                </div>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AboutUs;
