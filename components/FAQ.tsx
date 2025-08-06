
import React, { useState, useEffect } from 'react';
import { generateFaqs } from '../services/geminiService';
import { FaqItem } from '../types';
import { ChevronDownIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';

const FaqAccordionItem: React.FC<{ item: FaqItem; isOpen: boolean; onClick: () => void; }> = ({ item, isOpen, onClick }) => {
    return (
        <div className="border-b border-white/10">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center text-left py-5 px-6"
            >
                <span className="font-bold text-lg">{item.question}</span>
                {isOpen ? <MinusIcon className="h-6 w-6 text-cyan-400" /> : <PlusIcon className="h-6 w-6 text-slate-400" />}
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-6 pb-5 text-slate-300">
                    <p>{item.answer}</p>
                </div>
            </div>
        </div>
    );
};


export const FAQ = () => {
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    useEffect(() => {
        const fetchFaqs = async () => {
            setLoading(true);
            try {
                const generatedFaqs = await generateFaqs();
                setFaqs(generatedFaqs);
            } catch (error) {
                console.error("Failed to load FAQs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-center mb-12">
                <span className="text-glow-pink">Clearing the</span> Static
            </h2>
            <div className="max-w-4xl mx-auto glass-card rounded-lg">
                {loading ? (
                    <div className="p-8 text-center">
                        <p>Loading Intelligence Matrix...</p>
                        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400 mx-auto mt-4"></div>
                    </div>
                ) : (
                    <div>
                        {faqs.map((faq, index) => (
                           <FaqAccordionItem 
                             key={index} 
                             item={faq}
                             isOpen={openIndex === index}
                             onClick={() => handleToggle(index)}
                           />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
