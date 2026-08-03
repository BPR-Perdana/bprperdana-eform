import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, Clock, FileText, AlertTriangle, Loader2, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { getESignAgreement, acceptESignTOS, type ESignAgreementData } from '@/lib/api/applicationApi';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PRODUCT_LABEL: Record<string, string> = {
  SAVING: 'Tabungan',
  DEPOSIT: 'Deposito',
  LOAN: 'Pinjaman',
};

function formatDeadline(isoStr: string | null): string {
  if (!isoStr) return '-';
  return new Date(isoStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ESignAgreementPage() {
  const [searchParams] = useSearchParams();
  const appId = searchParams.get('id') ?? '';

  const [data, setData] = useState<ESignAgreementData | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(true);

  const [tosChecked, setTosChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!appId) {
      setLoadError('ID pengajuan tidak ditemukan. Pastikan link yang Anda buka sudah benar.');
      setLoading(false);
      return;
    }

    getESignAgreement(appId)
      .then((d) => {
        setData(d);
        if (d.tos_already_accepted) setTosChecked(true);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error
          ? err.message
          : 'Gagal memuat data kontrak. Coba buka link dari email Anda kembali.';
        setLoadError(msg);
      })
      .finally(() => setLoading(false));
  }, [appId]);

  const handleAccept = async () => {
    if (!tosChecked || !appId) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      const result = await acceptESignTOS(appId);
      setRedirecting(true);
      // Redirect ke sign link VIDA
      window.location.href = result.sign_link;
    } catch (err: unknown) {
      const msg = err instanceof Error
        ? err.message
        : 'Terjadi kesalahan. Silakan coba lagi.';
      setSubmitError(msg);
      setSubmitting(false);
    }
  };

  // ── Loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Memuat data kontrak…</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────────
  if (loadError || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-destructive/30">
          <CardContent className="p-6 text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-destructive mx-auto" />
            <h2 className="font-semibold text-foreground">Link Tidak Valid</h2>
            <p className="text-sm text-muted-foreground">
              {loadError || 'Pengajuan tidak ditemukan.'}
            </p>
            <p className="text-xs text-muted-foreground">
              Pastikan Anda membuka link langsung dari email BPR Perdana.
              Jika masalah berlanjut, hubungi{' '}
              <a href="mailto:cs@bprperdana.co.id" className="text-primary underline">
                cs@bprperdana.co.id
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Redirecting state ─────────────────────────────────────────────────────────
  if (redirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">
            Mengarahkan ke platform tanda tangan VIDA…
          </p>
        </div>
      </div>
    );
  }

  // ── Main UI ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8 px-4">
        <div className="max-w-lg mx-auto text-center">
          <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-90" />
          <h1 className="text-xl font-bold">Persetujuan Tanda Tangan Elektronik</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">BPR Perdana — eForm Onboarding</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">

        {/* Info Kontrak */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="w-4 h-4 text-primary" />
              Ringkasan Kontrak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Atas Nama</span>
              <span className="font-medium text-foreground">{data.customer_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Produk</span>
              <span className="font-medium text-foreground">
                {PRODUCT_LABEL[data.product_type] ?? data.product_type}
              </span>
            </div>
            {data.sign_deadline && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Batas Waktu TTD
                </span>
                <span className="font-medium text-foreground">
                  {formatDeadline(data.sign_deadline)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* TOS Card */}
        <Card className="border-primary/20">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold text-foreground text-sm">
              Syarat & Ketentuan eSign VIDA
            </h3>
            <div className="text-sm text-muted-foreground space-y-4 leading-relaxed text-justify">
              <p>
                Anda akan menggunakan tanda tangan elektronik berbasis sertifikat elektronik untuk menandatangani dokumen berjudul <strong>Formulir Layanan E-Form BPR Perdana</strong>. Sehubungan dengan hukum dan peraturan perundang-undangan yang berlaku yang mengatur mengenai Informasi dan Transaksi Elektronik (UU Nomor 11 Tahun 2008 tentang Informasi dan Transaksi Elektronik, PP Nomor 71 tahun 2018 tentang Penyelenggaraan Sistem dan Transaksi Elektronik, Peraturan Kominfo Nomor 11 Tahun 2022 tentang Tata Kelola Penyelenggaraan Sertifikasi Elektronik), Pengguna memahami bahwa tanda tangan elektronik berbasis sertifikat elektronik dalam suatu transaksi dan/atau dokumen merupakan suatu bentuk persetujuan dan penerimaan Pengguna: (1) untuk mengikatkan diri terhadap hubungan hukum dengan pihak lain yang disebutkan dalam dokumen yang bersangkutan dan/atau (2) atas seluruh informasi yang tertulis dalam dokumen tersebut.
              </p>
              <p>
                Guna menyediakan fasilitas pembubuhan tanda tangan elektronik berbasis sertifikat elektronik, <strong>PT BPR Daya Perdana Nusantara</strong> bekerja sama dengan VIDA sebagai PSrE terdaftar di Kemenkominfo. VIDA akan melakukan penerbitan sertifikat elektronik, yang mana akan digunakan sebagai data pembuatan tanda tangan elektronik. Tanda tangan elektronik berbasis sertifikat elektronik dapat mengidentifikasi identitas penanda tangan pada dokumen yang Anda tandatangani sesuai dengan peraturan perundang-undangan yang berlaku di Indonesia. Oleh karenanya, Anda menjamin keakuratan data pribadi yang Anda sediakan dan setuju atas pemrosesan data pribadi Anda tersebut untuk tujuan penerbitan sertifikat elektronik serta layanan lain yang melekat pada sertifikat elektronik yang dilakukan oleh VIDA. Anda telah membaca, memahami, dan setuju untuk terikat pada syarat dan ketentuan layanan Penyelenggara Sertifikasi Elektronik yang terdapat pada Perjanjian Kepemilikan Sertifikat Elektronik, Kebijakan Privasi PSrE, serta Pernyataan Penyelenggaraan Sertifikasi Elektronik yang dapat diakses melalui <a href="https://repo.vida.id" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://repo.vida.id</a>
              </p>
            </div>

            {/* Checkbox */}
            <div
              className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-colors cursor-pointer
                ${tosChecked
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-border hover:border-primary/30'
                }`}
              onClick={() => setTosChecked((v) => !v)}
              id="tos-checkbox-area"
            >
              <Checkbox
                id="tos-checkbox"
                checked={tosChecked}
                onCheckedChange={(checked) => setTosChecked(checked === true)}
                className="mt-0.5 shrink-0"
              />
              <label
                htmlFor="tos-checkbox"
                className="text-sm text-foreground cursor-pointer leading-relaxed select-none"
              >
                Saya telah membaca, memahami, dan{' '}
                <strong>menyetujui Syarat & Ketentuan</strong> penandatanganan kontrak secara
                elektronik melalui platform VIDA.
              </label>
            </div>

            {/* Already accepted badge */}
            {data.tos_already_accepted && (
              <div className="flex items-center gap-2 text-sm text-success">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Anda sudah menyetujui ketentuan ini sebelumnya.</span>
              </div>
            )}

            {/* Submit error */}
            {submitError && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{submitError}</p>
              </div>
            )}

            {/* CTA Button */}
            <Button
              id="btn-proceed-to-sign"
              className="w-full"
              size="lg"
              disabled={!tosChecked || submitting}
              onClick={handleAccept}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan persetujuan…
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Lanjut ke Tanda Tangan Digital
                </>
              )}
            </Button>

            {!tosChecked && (
              <p className="text-xs text-muted-foreground text-center">
                Centang kotak persetujuan di atas untuk mengaktifkan tombol
              </p>
            )}
          </CardContent>
        </Card>

        {/* Footer info */}
        <p className="text-xs text-muted-foreground text-center px-4 leading-relaxed">
          Anda akan diarahkan ke platform VIDA untuk menyelesaikan tanda tangan.
          Pastikan email & nomor HP Anda aktif untuk menerima kode verifikasi dari VIDA.
        </p>
      </div>
    </div>
  );
}
