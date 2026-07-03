        // DOM Handles
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        const pageSlider = document.getElementById('page-slider');
        const pageDisplay = document.getElementById('page-display');
        const dbSwitch = document.getElementById('db-switch');
        const aiSwitch = document.getElementById('ai-switch');

        const priceVal = document.getElementById('price-val');
        const pagesCostDisp = document.getElementById('pages-cost');
        const dbCostDisp = document.getElementById('db-cost');
        const aiCostDisp = document.getElementById('ai-cost');

        const formBudget = document.getElementById('form-budget');
        const formMessage = document.getElementById('form-message');
        const budgetField = document.getElementById('budget-field');
        const messageField = document.getElementById('message-field');
        const enquiryForm = document.getElementById('enquiry-form');
        const successBanner = document.getElementById('form-success-banner');

        // Toggle mobile nav drawer
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Dynamic pricing calculation formulas
        function calculatePrice() {
            const basePrice = 149; // landing setup base cost
            const pages = parseInt(pageSlider.value);

            // Scaled pricing structure
            const pagesCost = (pages - 1) * 50;
            const dbCost = dbSwitch.checked ? 199 : 0;
            const aiCost = aiSwitch.checked ? 149 : 0;

            // Premium/Express Delivery factor logic
            const isExpress = document.querySelector('input[name="speed"]:checked').value === 'express';
            let grandTotal = basePrice + pagesCost + dbCost + aiCost;

            if (isExpress) {
                grandTotal = Math.round(grandTotal * 1.25);
            }

            // Update UI
            pageDisplay.textContent = `${pages} Page${pages > 1 ? 's' : ''}`;
            priceVal.textContent = grandTotal;
            pagesCostDisp.textContent = pagesCost > 0 ? `$${pagesCost}` : '$0';

            if (dbSwitch.checked) {
                dbCostDisp.textContent = `$${dbCost}`;
                dbCostDisp.classList.remove('muted');
            } else {
                dbCostDisp.textContent = "Not selected";
                dbCostDisp.classList.add('muted');
            }

            if (aiSwitch.checked) {
                aiCostDisp.textContent = `$${aiCost}`;
                aiCostDisp.classList.remove('muted');
            } else {
                aiCostDisp.textContent = "Not selected";
                aiCostDisp.classList.add('muted');
            }

            return grandTotal;
        }

        // Attach listeners to calculator controls
        // pageSlider.addEventListener('input', calculatePrice);
        // dbSwitch.addEventListener('change', calculatePrice);
        // aiSwitch.addEventListener('change', calculatePrice);
        // document.querySelectorAll('input[name="speed"]').forEach(radio => {
        //     radio.addEventListener('change', (e) => {
        //         // Adjust border highlights on selection
        //         document.querySelectorAll('input[name="speed"]').forEach(r => {
        //             r.closest('label').classList.remove('active');
        //         });

        //         e.target.closest('label').classList.add('active');
        //         calculatePrice();
        //     });
        // });

        // "Lock in this estimate" CTA
        function applyEstimateToEnquiry() {
            const currentTotal = priceVal.textContent;
            const pageNum = pageSlider.value;
            const dbInclusion = dbSwitch.checked ? 'with Database integration' : 'no DB setup';
            const aiInclusion = aiSwitch.checked ? 'with AI Smart Chatbot features' : 'no AI chatbot';
            const speedOption = document.querySelector('input[name="speed"]:checked').value;

            // Prefill form budget and message fields
            formBudget.value = `$${currentTotal}`;
            formMessage.value = `Hi TriByte Team! I calculated an initial estimate on your website of $${currentTotal} for ${pageNum} page(s) (${dbInclusion}, ${aiInclusion}, speed level: ${speedOption}). Let's discuss details!`;

            // Scroll user smoothly to the contact box
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });

            // Visual bounce feedback on fields
            budgetField.classList.add('ring');
            messageField.classList.add('ring');
            setTimeout(() => {
                budgetField.classList.remove('ring');
                messageField.classList.remove('ring');
            }, 1500);
        }

        // Handle enquiry submission
        enquiryForm.addEventListener('submit', async (e) => {
            if (window.location.protocol === 'file:') {
                return;
            }

            e.preventDefault();

            try {
                const response = await fetch(enquiryForm.action, {
                    method: 'POST',
                    body: new FormData(enquiryForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    successBanner.classList.remove('hidden');
                    enquiryForm.reset();
                    successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    setTimeout(() => {
                        successBanner.classList.add('hidden');
                    }, 15000);
                } else {
                    enquiryForm.submit();
                }
            } catch (error) {
                enquiryForm.submit();
            }
        });

        // Initialize values on load
        window.onload = function() {
            calculatePrice();
        }