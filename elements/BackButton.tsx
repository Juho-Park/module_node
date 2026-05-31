'use client'
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export default function BackButton({ href }: { href?: string }) {
    const router = useRouter()
    return <Button variant='ghost' size='icon' onClick={() => href ? router.push(href) : router.back()}><ArrowLeftIcon /></Button>
}

