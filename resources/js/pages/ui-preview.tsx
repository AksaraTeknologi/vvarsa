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

            {/* Diubah ke bg-[#121214] agar serasi dengan Card bertema gelap Anda */}
            <main className="min-h-screen bg-[#121214] px-5 py-10 text-white sm:px-8">
                <div className="mx-auto max-w-5xl space-y-8">
                    <header className="space-y-2">
                        <Badge variant="secondary">Component Lab</Badge>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">UI Preview</h1>
                        <p className="max-w-2xl text-gray-400">Tempat untuk melihat dan mencoba komponen UI yang sudah tersedia.</p>
                    </header>

                    <Separator className="bg-[#2c2c2e]" />

                    <section className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold">Buttons</h2>
                            <p className="text-sm text-gray-400">Semua variant dan ukuran Button.</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button>
                                <Plus />
                                Default
                            </Button>
                            <Button variant="admin">Admin</Button>
                            <Button variant="owner">Owner</Button>
                            <Button variant="supervisor">Supervisor</Button>
                            <Button variant="staff">Staff</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="save">Save</Button>
                            <Button variant="edit">Edit</Button>
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
                                    <Label htmlFor="preview-search" className="text-gray-300">
                                        Search
                                    </Label>
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-gray-500" />
                                        {/* Input disesuaikan sedikit agar serasi dengan gaya gelap */}
                                        <Input
                                            id="preview-search"
                                            className="h-12 rounded-full border-[#3a3a3c] bg-[#2c2c2e] pl-11 text-white"
                                            placeholder="Cari sesuatu..."
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="preview-note" className="text-gray-300">
                                        Catatan
                                    </Label>
                                    <Textarea
                                        id="preview-note"
                                        className="rounded-xl border-[#3a3a3c] bg-[#2c2c2e] text-white"
                                        placeholder="Tulis catatan..."
                                    />
                                </div>
                                <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-gray-300">
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
                                {/* Diubah dari bg-white ke bg-[#2c2c2e] agar menyatu dengan tema gelap Card */}
                                <div className="flex items-center justify-between rounded-2xl border border-[#3a3a3c] bg-[#2c2c2e] p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-950/50 text-emerald-400">
                                            <Check className="size-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">Pembayaran diterima</p>
                                            <p className="text-xs text-gray-400">Baru saja</p>
                                        </div>
                                    </div>
                                    <Badge className="border border-emerald-500/30 bg-emerald-500/20 text-emerald-400">Success</Badge>
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
