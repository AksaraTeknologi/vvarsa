import { Head } from '@inertiajs/react';
import { Check, ChevronRight, Plus, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

export default function UiPreview() {
    return (
        <>
            <Head title="UI Preview" />

            <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-950 sm:px-8">
                <div className="mx-auto max-w-5xl space-y-8">
                    <header className="space-y-2">
                        <Badge variant="secondary">Component Lab</Badge>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">UI Preview</h1>
                        <p className="max-w-2xl text-slate-600">
                            Tempat untuk melihat dan mencoba komponen UI yang sudah tersedia.
                        </p>
                    </header>

                    <Separator />

                    <section className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold">Buttons</h2>
                            <p className="text-sm text-slate-600">Semua variant dan ukuran Button.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button>
                                <Plus />
                                Default
                            </Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="save">save</Button>
                            <Button variant="edit">edit</Button>
                            <Button variant="dark">Dark</Button>
                            <Button variant="destructive">Delete</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="link">Link</Button>
                            <Button size="sm">Small</Button>
                            <Button size="lg">Large</Button>
                            <Button size="icon" aria-label="Search">
                                <Search />
                            </Button>
                        </div>
                    </section>

                    <section className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Form controls</CardTitle>
                                <CardDescription>Contoh input untuk halaman aplikasi.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="preview-search">Search</Label>
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
                                        <Input id="preview-search" className="pl-9" placeholder="Cari sesuatu..." />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="preview-note">Catatan</Label>
                                    <Textarea id="preview-note" placeholder="Tulis catatan..." />
                                </div>
                                <label className="flex items-center gap-3 text-sm font-medium">
                                    <Checkbox defaultChecked />
                                    Aktifkan notifikasi
                                </label>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Status dan actions</CardTitle>
                                <CardDescription>Gabungan komponen dalam sebuah card.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between rounded-xl border bg-white p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                            <Check className="size-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Pembayaran diterima</p>
                                            <p className="text-sm text-slate-500">Baru saja</p>
                                        </div>
                                    </div>
                                    <Badge>Success</Badge>
                                </div>
                                <Button className="w-full">
                                    Lihat detail
                                    <ChevronRight />
                                </Button>
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </main>
        </>
    );
}