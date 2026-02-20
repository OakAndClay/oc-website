import ProductPage from '@/components/ProductPage';

export default function TermsPage() {
  return (
    <div className="flex flex-col items-center mt-12 px-4 w-full">
      <ProductPage className="mb-20">
        <h2 className="font-cinzel text-3xl mb-6">Terms of Use</h2>
        <div className="font-roboto text-stone-700 space-y-4 text-sm leading-relaxed">
          <p><strong>Last Updated:</strong> February 2026</p>

          <h3 className="font-cinzel text-xl mt-6">1. Acceptance of Terms</h3>
          <p>
            By accessing and using the Oak and Clay website and services, you agree to be bound by these
            Terms of Use. If you do not agree, please do not use our services.
          </p>

          <h3 className="font-cinzel text-xl mt-6">2. Products and Services</h3>
          <p>
            Oak and Clay offers timber frame kits and piece drawings/plans for purchase. All products are
            subject to availability and pricing may change without notice.
          </p>

          <h3 className="font-cinzel text-xl mt-6">3. Orders and Payment</h3>
          <p>
            Kit orders require a 50% deposit at the time of order. The remaining balance must be paid before
            fabrication begins. Plan/drawing purchases require full payment at checkout.
          </p>

          <h3 className="font-cinzel text-xl mt-6">4. Cryptocurrency Payments</h3>
          <p>
            Cryptocurrency payments are subject to a processing fee. The fee percentage is displayed at checkout.
            Cryptocurrency payments are non-refundable once confirmed on the blockchain.
          </p>

          <h3 className="font-cinzel text-xl mt-6">5. Intellectual Property</h3>
          <p>
            All plans and drawings purchased from Oak and Clay are for personal use only. Redistribution,
            resale, or commercial use of plans without written permission is prohibited.
          </p>

          <h3 className="font-cinzel text-xl mt-6">6. Limitation of Liability</h3>
          <p>
            Oak and Clay provides timber frame kits and plans as-is. We are not responsible for construction
            outcomes. All building should comply with local codes and regulations.
          </p>

          <h3 className="font-cinzel text-xl mt-6">7. Contact</h3>
          <p>
            For questions about these terms, please contact us at craft@oakandclay.com.
          </p>
        </div>
      </ProductPage>
    </div>
  );
}
