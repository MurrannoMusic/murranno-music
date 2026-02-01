import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { ShieldCheck, Upload, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function KYCVerification() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user, profile, refreshUserData } = useAuth();
    const { uploadImage, uploading } = useCloudinaryUpload();

    const [ninNumber, setNinNumber] = useState('');
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [documentPreview, setDocumentPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setDocumentFile(file);
            const previewUrl = URL.createObjectURL(file);
            setDocumentPreview(previewUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;
        if (!ninNumber) {
            toast({
                title: "Missing Information",
                description: "Please enter your NIN Number.",
                variant: "destructive"
            });
            return;
        }
        if (!documentFile) {
            toast({
                title: "Missing Document",
                description: "Please upload your ID document.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload ID Document
            const { url: documentUrl } = await uploadImage(documentFile, 'kyc-documents');

            // 2. Update Profile with KYC Data
            const { error } = await supabase
                .from('profiles')
                .update({
                    nin_number: ninNumber,
                    id_document_url: documentUrl,
                    id_document_type: 'national_id', // You can expand this dropdown later
                    kyc_status: 'pending',
                    kyc_tier: 1 // Remains 1 until admin approves, or 2 if auto-verified
                })
                .eq('id', user.id);

            if (error) throw error;

            await refreshUserData();

            toast({
                title: "Verification Submitted",
                description: "Your documents are being reviewed. You will be notified once approved.",
            });

            // Navigate back or to success state
            navigate('/app/settings');

        } catch (error: any) {
            console.error('KYC Submission error:', error);
            toast({
                title: "Submission Failed",
                description: error.message || "Could not submit verification. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!profile) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const isPending = profile.kyc_status === 'pending';
    const isVerified = profile.kyc_status === 'verified';

    if (isPending) {
        return (
            <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
                <Card className="p-8 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold">Verification In Progress</h2>
                    <p className="text-muted-foreground">
                        Your documents have been submitted and are under review. This usually takes 24-48 hours.
                    </p>
                    <Button variant="outline" onClick={() => navigate('/app/dashboard')}>
                        Return to Dashboard
                    </Button>
                </Card>
            </div>
        );
    }

    if (isVerified) {
        return (
            <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
                <Card className="p-8 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold">You are Verified!</h2>
                    <p className="text-muted-foreground">
                        Your identity has been verified. You have full access to all features.
                    </p>
                    <Button onClick={() => navigate('/app/dashboard')}>
                        Go to Dashboard
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Identity Verification</h1>
                <p className="text-muted-foreground">
                    To ensure the safety of our platform and comply with regulations, we need to verify your identity before you can upload music or withdraw funds.
                </p>
            </div>

            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-2">
                        <Label htmlFor="nin">NIN Number (National Identification Number)</Label>
                        <Input
                            id="nin"
                            placeholder="Enter your 11-digit NIN"
                            value={ninNumber}
                            onChange={(e) => setNinNumber(e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            Your information is encrypted and stored securely.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>ID Document Upload</Label>
                        <div
                            className="border-2 border-dashed border-input rounded-lg p-8 text-center hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {documentPreview ? (
                                <div className="relative">
                                    <img
                                        src={documentPreview}
                                        alt="ID Preview"
                                        className="max-h-48 mx-auto rounded-md object-contain"
                                    />
                                    <p className="mt-2 text-sm text-muted-foreground">Click to change</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <Upload className="w-8 h-8" />
                                    <p>Click to upload your NIN Card or International Passport</p>
                                    <p className="text-xs">JPG, PNG or PDF up to 5MB</p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/*,application/pdf"
                                onChange={handleFileSelect}
                            />
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-4 flex gap-3 text-sm text-yellow-500">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>
                            Please ensure your document is clear, valid, and matches the name on your profile. mismatched information may lead to rejection.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || uploading}>
                            {isSubmitting || uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting Verification...
                                </>
                            ) : (
                                "Submit for Verification"
                            )}
                        </Button>
                        <Button type="button" variant="ghost" className="w-full" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
