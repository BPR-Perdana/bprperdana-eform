import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AgreementStepProps {
  agreed: boolean;
  onAgree: (agreed: boolean) => void;
}

export function AgreementStep({ agreed, onAgree }: AgreementStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t('ekyc.agreement')}</h2>
        <p className="text-muted-foreground">
          {t('ekyc.subtitle')}
        </p>
      </div>

      <Card className="p-6">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4 text-sm">
            
            <div className="space-y-2">
              <p className="text-muted-foreground text-justify">
                {t('ekyc.agreements.vida_tnc')}
              </p>
              <br />
              <p className="text-muted-foreground text-justify">
                {t('ekyc.agreements.vida_tnc_sub')}{' '}
                <a href="https://repo.vida.id" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  https://repo.vida.id
                </a>
              </p>
            </div>
      
          </div>
        </ScrollArea>
      </Card>

      <div className="flex items-start space-x-3 p-4 border rounded-lg bg-muted/50">
        <Checkbox
          id="agreement"
          checked={agreed}
          onCheckedChange={(checked) => onAgree(checked as boolean)}
        />
        <div className="flex-1">
          <label
            htmlFor="agreement"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {t('ekyc.agreementText')}
          </label>
        </div>
      </div>
    </div>
  );
}
