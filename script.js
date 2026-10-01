// @ts-nocheck

/* =========================================
   OLAYINKA PHOTOGRAPHY
   MAIN WEBSITE JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", async () => {

  /* =========================================
     SUPABASE
  ========================================== */

  const supabaseUrl =
    window.OLAYINKA_SUPABASE_URL;

  const supabaseKey =
    window.OLAYINKA_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "Supabase configuration is missing."
    );
    return;
  }

  const supabaseClient =
    window.supabase.createClient(
      supabaseUrl,
      supabaseKey
    );


  /* =========================================
     PORTFOLIO ELEMENTS
  ========================================== */

  const categoriesContainer =
    document.getElementById(
      "portfolioCategories"
    );

  const galleryContainer =
    document.getElementById(
      "portfolioGallery"
    );

  const galleryGrid =
    document.getElementById(
      "galleryGrid"
    );

  const galleryTitle =
    document.getElementById(
      "galleryTitle"
    );

  const galleryEyebrow =
    document.getElementById(
      "galleryEyebrow"
    );

  const galleryDescription =
    document.getElementById(
      "galleryDescription"
    );

  const backButton =
    document.getElementById(
      "portfolioBack"
    );


  /* =========================================
     SERVICES ELEMENT
  ========================================== */

  const publicServicesGrid =
    document.getElementById(
      "publicServicesGrid"
    );


  let portfolioItems = [];

  let siteSettings = null;


  /* =========================================
     HTML ESCAPE
  ========================================== */

  function escapeHtml(value) {

    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  function escapeHtmlAttribute(value) {

    return escapeHtml(value);

  }


  /* =========================================
     FORMAT PRICE
  ========================================== */

  function formatPrice(
    price,
    currency
  ) {

    if (
      price === null ||
      price === undefined ||
      price === ""
    ) {
      return "Contact us for pricing";
    }


    const amount =
      Number(price);


    if (
      Number.isNaN(amount)
    ) {
      return (
        escapeHtml(currency || "NGN") +
        " " +
        escapeHtml(price)
      );
    }


    let currencyCode =
      currency ||
      "NGN";


    try {

      return new Intl.NumberFormat(
        "en-NG",
        {
          style: "currency",
          currency: currencyCode,
          maximumFractionDigits: 0
        }
      ).format(amount);

    } catch (error) {

      return (
        escapeHtml(currencyCode) +
        " " +
        amount.toLocaleString()
      );

    }

  }


  /* =========================================
     FORMAT DURATION
  ========================================== */

  function formatDuration(
    duration
  ) {

    if (
      duration === null ||
      duration === undefined ||
      duration === ""
    ) {
      return "";
    }


    const value =
      Number(duration);


    if (
      Number.isNaN(value)
    ) {
      return String(duration);
    }


    if (value === 1) {
      return "1 hour";
    }


    return value + " hours";

  }


  /* =========================================
     FORMAT FEATURES
  ========================================== */

  function formatFeatures(
    features
  ) {

    if (!features) {
      return [];
    }


    if (
      Array.isArray(features)
    ) {

      return features
        .filter(
          item =>
            item !== null &&
            item !== undefined &&
            String(item).trim() !== ""
        )
        .map(
          item =>
            String(item)
        );

    }


    if (
      typeof features ===
      "string"
    ) {

      try {

        const parsed =
          JSON.parse(features);


        if (
          Array.isArray(parsed)
        ) {

          return parsed
            .filter(
              item =>
                item !== null &&
                item !== undefined &&
                String(item).trim() !== ""
            )
            .map(
              item =>
                String(item)
            );

        }

      } catch (error) {

        return features
          .split(
            /[,|\n]+/
          )
          .map(
            item =>
              item.trim()
          )
          .filter(
            item =>
              item !== ""
          );

      }

    }


    return [];

  }


  /* =========================================
     CATEGORY NAME
  ========================================== */

  function formatCategoryName(
    category
  ) {

    if (!category) {
      return "Other";
    }


    const names = {

      portraits:
        "Portrait",

      portrait:
        "Portrait",

      weddings:
        "Wedding",

      wedding:
        "Wedding",

      fashion:
        "Fashion",

      professional:
        "Professional",

      "personal-brand":
        "Personal / Brand",

      personal_brand:
        "Personal / Brand",

      "personal brand":
        "Personal / Brand",

      events:
        "Events",

      event:
        "Events",

      graduation:
        "Graduation",

      lifestyle:
        "Lifestyle"

    };


    const key =
      category
        .toLowerCase()
        .trim();


    if (names[key]) {
      return names[key];
    }


    return category
      .replace(
        /[-_]/g,
        " "
      )
      .replace(
        /\b\w/g,
        letter =>
          letter.toUpperCase()
      );

  }


  /* =========================================
     CATEGORY DESCRIPTION
  ========================================== */

  function getCategoryDescription(
    category
  ) {

    if (!category) {

      return (
        "Explore this photography collection."
      );

    }


    const descriptions = {

      portraits:
        "Personal portraits and creative sessions.",

      portrait:
        "Personal portraits and creative sessions.",

      weddings:
        "Meaningful moments from wedding celebrations.",

      wedding:
        "Meaningful moments from wedding celebrations.",

      fashion:
        "Creative fashion photography focused on style and detail.",

      professional:
        "Professional photography for individuals and organizations.",

      "personal-brand":
        "Photography created for personal and professional brands.",

      personal_brand:
        "Photography created for personal and professional brands.",

      "personal brand":
        "Photography created for personal and professional brands.",

      events:
        "Photography from special events and celebrations.",

      event:
        "Photography from special events and celebrations.",

      graduation:
        "Beautiful moments captured during graduation celebrations.",

      lifestyle:
        "Natural photography capturing everyday moments and experiences."

    };


    const key =
      category
        .toLowerCase()
        .trim();


    return (
      descriptions[key] ||
      "Explore this photography collection."
    );

  }


  /* =========================================
     SETTINGS
  ========================================== */

  async function loadSiteSettings() {

    const {
      data,
      error
    } =
      await supabaseClient
        .from("admin_settings")
        .select(`
          business_name,
          business_email,
          business_phone,
          whatsapp_number,
          address,
          business_hours,
          deposit_percentage,
          payment_instructions,
          social_links,
          logo_url,
          photographer_photo_url
        `)
        .limit(1)
        .maybeSingle();


    if (error) {

      console.error(
        "Settings loading error:",
        error
      );

      return;

    }


    siteSettings =
      data || null;


    if (!siteSettings) {
      return;
    }


    applySiteSettings();

  }


  /* =========================================
     APPLY SETTINGS
  ========================================== */

  function applySiteSettings() {

    if (!siteSettings) {
      return;
    }


    const settings =
      siteSettings;


    /* BUSINESS NAME */

    document
      .querySelectorAll(
        "[data-business-name]"
      )
      .forEach(element => {

        element.textContent =
          settings.business_name ||
          "OLAYINKA PHOTOGRAPHY";

      });


    /* EMAIL */

    document
      .querySelectorAll(
        "[data-business-email]"
      )
      .forEach(element => {

        const email =
          settings.business_email ||
          "olayinkae001@gmail.com";


        const label =
          element.querySelector(
            ".contact-link-label"
          );


        if (label) {

          label.textContent =
            "Email";

        } else {

          element.textContent =
            email;

        }


        if (
          element.tagName === "A"
        ) {

          element.href =
            "mailto:" + email;

        }

      });


    /* PHONE */

    document
      .querySelectorAll(
        "[data-business-phone]"
      )
      .forEach(element => {

        const phone =
          settings.business_phone ||
          "+2348110998485";


        const label =
          element.querySelector(
            ".contact-link-label"
          );


        if (label) {

          label.textContent =
            "Phone";

        } else {

          element.textContent =
            phone;

        }


        if (
          element.tagName === "A"
        ) {

          element.href =
            "tel:" +
            phone.replace(
              /\s+/g,
              ""
            );

        }

      });


    /* WHATSAPP */

    document
      .querySelectorAll(
        "[data-business-whatsapp]"
      )
      .forEach(element => {

        const whatsapp =
          settings.whatsapp_number ||
          settings.business_phone ||
          "+2348110998485";


        const label =
          element.querySelector(
            ".contact-link-label"
          );


        if (label) {

          label.textContent =
            "WhatsApp";

        } else {

          element.textContent =
            whatsapp;

        }


        if (
          element.tagName === "A"
        ) {

          const cleanNumber =
            whatsapp.replace(
              /\D/g,
              ""
            );


          element.href =
            "https://wa.me/" +
            cleanNumber;


          element.target =
            "_blank";


          element.rel =
            "noopener noreferrer";

        }

      });


    /* ADDRESS */

    document
      .querySelectorAll(
        "[data-business-address]"
      )
      .forEach(element => {

        element.textContent =
          settings.address ||
          "Ibadan, Oyo State, Nigeria";

      });


    /* BUSINESS HOURS */

    document
      .querySelectorAll(
        "[data-business-hours]"
      )
      .forEach(element => {

        element.textContent =
          settings.business_hours ||
          "By appointment";

      });


    /* LOGO */

    if (
      settings.logo_url
    ) {

      document
        .querySelectorAll(
          "[data-business-logo]"
        )
        .forEach(image => {

          image.src =
            settings.logo_url;

        });

    }


    /* PHOTOGRAPHER PHOTO */

    if (
      settings.photographer_photo_url
    ) {

      document
        .querySelectorAll(
          "[data-photographer-photo]"
        )
        .forEach(image => {

          image.src =
            settings.photographer_photo_url;

        });

    }


    /* SOCIAL LINKS */

    applySocialLinks(
      settings.social_links
    );

  }


  /* =========================================
     SOCIAL LINKS
  ========================================== */

  function applySocialLinks(
    socialLinks
  ) {

    if (!socialLinks) {
      return;
    }


    let links =
      socialLinks;


    if (
      typeof socialLinks ===
      "string"
    ) {

      try {

        links =
          JSON.parse(
            socialLinks
          );

      } catch (error) {

        console.error(
          "Social links JSON error:",
          error
        );

        return;

      }

    }


    const instagram =
      links.instagram ||
      links.Instagram ||
      "";

    const facebook =
      links.facebook ||
      links.Facebook ||
      "";

    const tiktok =
      links.tiktok ||
      links.TikTok ||
      "";


    document
      .querySelectorAll(
        "[data-social-instagram]"
      )
      .forEach(element => {

        if (instagram) {

          element.href =
            instagram;

          element.target =
            "_blank";

          element.rel =
            "noopener noreferrer";

        }

      });


    document
      .querySelectorAll(
        "[data-social-facebook]"
      )
      .forEach(element => {

        if (facebook) {

          element.href =
            facebook;

          element.target =
            "_blank";

          element.rel =
            "noopener noreferrer";

        }

      });


    document
      .querySelectorAll(
        "[data-social-tiktok]"
      )
      .forEach(element => {

        if (tiktok) {

          element.href =
            tiktok;

          element.target =
            "_blank";

          element.rel =
            "noopener noreferrer";

        }

      });

  }


  /* =========================================
     PUBLIC SERVICES
  ========================================== */

  async function loadPublicServices() {

    if (
      !publicServicesGrid
    ) {
      return;
    }


    publicServicesGrid.innerHTML = `
      <p class="services-message">
        Loading services...
      </p>
    `;


    const {
      data,
      error
    } =
      await supabaseClient
        .from("services")
        .select(`
          id,
          name,
          slug,
          description,
          image_url,
          is_active,
          sort_order,
          service_packages (
            id,
            name,
            description,
            price,
            currency,
            duration,
            features,
            is_active,
            sort_order
          )
        `)
        .eq(
          "is_active",
          true
        )
        .order(
          "sort_order",
          {
            ascending: true
          }
        );


    if (error) {

      console.error(
        "Public services loading error:",
        error
      );


      publicServicesGrid.innerHTML = `
        <p class="services-message">
          Unable to load services right now.
        </p>
      `;

      return;

    }


    const services =
      Array.isArray(data)
        ? data
        : [];


    if (
      services.length === 0
    ) {

      publicServicesGrid.innerHTML = `
        <p class="services-message">
          Our photography services will be available soon.
        </p>
      `;

      return;

    }


    publicServicesGrid.innerHTML =
      "";


    services.forEach(
      (
        service,
        serviceIndex
      ) => {

        const card =
          document.createElement(
            "article"
          );


        card.className =
          "service-card public-service-card";


        const activePackages =
          Array.isArray(
            service.service_packages
          )
            ? service.service_packages
                .filter(
                  packageItem =>
                    packageItem.is_active !== false
                )
                .sort(
                  (
                    a,
                    b
                  ) =>
                    (
                      a.sort_order || 0
                    ) -
                    (
                      b.sort_order || 0
                    )
                )
            : [];


        let packagesHtml =
          "";


        if (
          activePackages.length > 0
        ) {

          packagesHtml = `
            <div class="public-service-packages">
          `;


          activePackages.forEach(
            packageItem => {

              const features =
                formatFeatures(
                  packageItem.features
                );


              let featuresHtml =
                "";


              if (
                features.length > 0
              ) {

                featuresHtml = `
                  <ul
                    style="
                      margin:8px 0 0;
                      padding-left:18px;
                      font-size:13px;
                      opacity:.75;
                    "
                  >
                `;


                features.forEach(
                  feature => {

                    featuresHtml += `
                      <li>
                        ${escapeHtml(
                          feature
                        )}
                      </li>
                    `;

                  }
                );


                featuresHtml +=
                  "</ul>";

              }


              packagesHtml += `

                <div class="public-package">

                  <div class="public-package-name">
                    ${escapeHtml(
                      packageItem.name ||
                      "Package"
                    )}
                  </div>

                  <div class="public-package-price">
                    ${formatPrice(
                      packageItem.price,
                      packageItem.currency
                    )}
                  </div>

                  ${
                    packageItem.duration
                      ? `
                        <div class="public-package-duration">
                          ${escapeHtml(
                            formatDuration(
                              packageItem.duration
                            )
                          )}
                        </div>
                      `
                      : ""
                  }

                  ${
                    packageItem.description
                      ? `
                        <div
                          style="
                            margin-top:6px;
                            font-size:13px;
                            opacity:.75;
                          "
                        >
                          ${escapeHtml(
                            packageItem.description
                          )}
                        </div>
                      `
                      : ""
                  }

                  ${featuresHtml}

                </div>

              `;

            }
          );


          packagesHtml +=
            "</div>";

        } else {

          packagesHtml = `
            <div
              class="public-service-packages"
            >

              <div class="public-package">

                <div class="public-package-name">
                  Pricing available on request
                </div>

                <div class="public-package-price">
                  Contact us for package details.
                </div>

              </div>

            </div>
          `;

        }


        card.innerHTML = `

          <span class="public-service-number">
            ${String(
              serviceIndex + 1
            ).padStart(
              2,
              "0"
            )}
          </span>

          <h3>
            ${escapeHtml(
              service.name ||
              "Photography Service"
            )}
          </h3>

          <p class="public-service-description">
            ${
              service.description
                ? escapeHtml(
                    service.description
                  )
                : "Professional photography created around your story."
            }
          </p>

          ${packagesHtml}

          <a
            href="login.html"
            class="public-service-book"
          >
            Book this service →
          </a>

        `;


        publicServicesGrid.appendChild(
          card
        );

      }
    );

  }


  /* =========================================
     PUBLIC TESTIMONIALS
  ========================================== */

  async function loadPublicTestimonials() {

    const testimonialsGrid =
      document.getElementById(
        "testimonialsGrid"
      );


    if (!testimonialsGrid) {
      return;
    }


    testimonialsGrid.innerHTML = `
      <article class="testimonial-card">
        <p>
          Loading client experiences...
        </p>
      </article>
    `;


    const {
      data,
      error
    } =
      await supabaseClient
        .from("testimonials")
        .select(`
          id,
          customer_name,
          customer_title,
          testimonial,
          rating,
          created_at,
          services (
            name
          )
        `)
        .eq(
          "is_published",
          true
        )
        .order(
          "sort_order",
          {
            ascending: true
          }
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    if (error) {

      console.error(
        "Public testimonials loading error:",
        error
      );


      testimonialsGrid.innerHTML = `
        <article class="testimonial-card">

          <p>
            Client testimonials will appear here.
          </p>

          <strong>
            — OLAYINKA PHOTOGRAPHY
          </strong>

        </article>
      `;

      return;

    }


    const testimonials =
      Array.isArray(data)
        ? data
        : [];


    if (
      testimonials.length === 0
    ) {

      testimonialsGrid.innerHTML = `
        <article class="testimonial-card">

          <p>
            Client testimonials will appear here.
          </p>

          <strong>
            — OLAYINKA PHOTOGRAPHY
          </strong>

        </article>
      `;

      return;

    }


    testimonialsGrid.innerHTML =
      "";


    testimonials.forEach(
      testimonial => {

        const card =
          document.createElement(
            "article"
          );


        card.className =
          "testimonial-card";


        const rating =
          Number(
            testimonial.rating
          );


        let stars =
          "";


        if (
          rating >= 1 &&
          rating <= 5
        ) {

          stars =
            "★".repeat(rating) +
            "☆".repeat(5 - rating);

        }


        const serviceName =
          testimonial.services &&
          testimonial.services.name
            ? testimonial.services.name
            : "";


        card.innerHTML = `

          ${
            stars
              ? `
                <div
                  style="
                    margin-bottom:10px;
                    letter-spacing:2px;
                  "
                  aria-label="${rating} out of 5 stars"
                >
                  ${stars}
                </div>
              `
              : ""
          }

          <p>
            “${escapeHtml(
              testimonial.testimonial
            )}”
          </p>

          <strong>
            — ${escapeHtml(
              testimonial.customer_name ||
              "Client"
            )}
          </strong>

          ${
            testimonial.customer_title
              ? `
                <div
                  style="
                    margin-top:5px;
                    opacity:.7;
                    font-size:14px;
                  "
                >
                  ${escapeHtml(
                    testimonial.customer_title
                  )}
                </div>
              `
              : ""
          }

          ${
            serviceName
              ? `
                <div
                  style="
                    margin-top:8px;
                    opacity:.65;
                    font-size:13px;
                  "
                >
                  ${escapeHtml(
                    serviceName
                  )}
                </div>
              `
              : ""
          }

        `;


        testimonialsGrid.appendChild(
          card
        );

      }
    );

  }


  /* =========================================
     IMAGE VIEWER
  ========================================== */

  let viewer = null;

  let viewerImage = null;

  let scale = 1;

  let imageX = 0;

  let imageY = 0;

  let dragging = false;

  let dragStartX = 0;

  let dragStartY = 0;

  let pinchStartDistance = 0;

  let pinchStartScale = 1;


  /* =========================================
     VIEWER CSS
  ========================================== */

  function addViewerStyles() {

    if (
      document.getElementById(
        "olayinkaViewerStyles"
      )
    ) {
      return;
    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "olayinkaViewerStyles";


    style.textContent = `

      .zoom-view {
        position: fixed;
        inset: 0;
        z-index: 999999;
        display: none;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.96);
        overflow: hidden;
        touch-action: none;
      }

      .zoom-view img {
        max-width: 92vw;
        max-height: 88vh;
        width: auto;
        height: auto;
        object-fit: contain;
        user-select: none;
        -webkit-user-select: none;
        cursor: grab;
        transform-origin: center center;
        will-change: transform;
        touch-action: none;
      }

      .zoom-view img.dragging {
        cursor: grabbing;
      }

      .zoom-close {
        position: absolute;
        top: 18px;
        right: 20px;
        z-index: 2;
        width: 46px;
        height: 46px;
        border: 1px solid rgba(255,255,255,0.25);
        border-radius: 50%;
        background: rgba(0,0,0,0.55);
        color: #fff;
        font-size: 30px;
        line-height: 1;
        cursor: pointer;
      }

      .zoom-close:hover {
        background: rgba(255,255,255,0.15);
      }

    `;


    document.head.appendChild(
      style
    );

  }


  /* =========================================
     CREATE VIEWER
  ========================================== */

  function createViewer() {

    addViewerStyles();


    viewer =
      document.createElement(
        "div"
      );


    viewer.className =
      "zoom-view";


    viewer.innerHTML = `

      <button
        class="zoom-close"
        type="button"
        aria-label="Close image"
      >
        ×
      </button>

      <img
        src=""
        alt="Portfolio image"
        draggable="false"
      >

    `;


    document.body.appendChild(
      viewer
    );


    viewerImage =
      viewer.querySelector(
        "img"
      );


    const closeButton =
      viewer.querySelector(
        ".zoom-close"
      );


    closeButton.addEventListener(
      "click",
      closeViewer
    );


    viewer.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          viewer
        ) {

          closeViewer();

        }

      }
    );


    viewerImage.addEventListener(
      "pointerdown",
      event => {

        if (
          scale <= 1
        ) {
          return;
        }


        dragging = true;


        dragStartX =
          event.clientX -
          imageX;


        dragStartY =
          event.clientY -
          imageY;


        viewerImage.classList.add(
          "dragging"
        );


        try {

          viewerImage.setPointerCapture(
            event.pointerId
          );

        } catch (error) {}

      }
    );


    viewerImage.addEventListener(
      "pointermove",
      event => {

        if (!dragging) {
          return;
        }


        imageX =
          event.clientX -
          dragStartX;


        imageY =
          event.clientY -
          dragStartY;


        updateImage();

      }
    );


    viewerImage.addEventListener(
      "pointerup",
      event => {

        dragging = false;


        viewerImage.classList.remove(
          "dragging"
        );


        try {

          viewerImage.releasePointerCapture(
            event.pointerId
          );

        } catch (error) {}

      }
    );


    viewerImage.addEventListener(
      "pointercancel",
      () => {

        dragging = false;


        viewerImage.classList.remove(
          "dragging"
        );

      }
    );


    viewerImage.addEventListener(
      "wheel",
      event => {

        event.preventDefault();


        if (
          event.deltaY < 0
        ) {

          scale += 0.25;

        } else {

          scale -= 0.25;

        }


        scale =
          Math.max(
            1,
            Math.min(
              scale,
              6
            )
          );


        if (
          scale === 1
        ) {

          imageX = 0;

          imageY = 0;

        }


        updateImage();

      },
      {
        passive: false
      }
    );


    viewerImage.addEventListener(
      "touchstart",
      event => {

        if (
          event.touches.length === 2
        ) {

          event.preventDefault();


          pinchStartDistance =
            getTouchDistance(
              event.touches[0],
              event.touches[1]
            );


          pinchStartScale =
            scale;

        }

      },
      {
        passive: false
      }
    );


    viewerImage.addEventListener(
      "touchmove",
      event => {

        if (
          event.touches.length === 2
        ) {

          event.preventDefault();


          const currentDistance =
            getTouchDistance(
              event.touches[0],
              event.touches[1]
            );


          if (
            pinchStartDistance > 0
          ) {

            scale =
              pinchStartScale *
              (
                currentDistance /
                pinchStartDistance
              );


            scale =
              Math.max(
                1,
                Math.min(
                  scale,
                  6
                )
              );


            if (
              scale === 1
            ) {

              imageX = 0;

              imageY = 0;

            }


            updateImage();

          }

        }

      },
      {
        passive: false
      }
    );


    viewerImage.addEventListener(
      "touchend",
      () => {

        pinchStartDistance = 0;

      }
    );

  }


  /* =========================================
     TOUCH DISTANCE
  ========================================== */

  function getTouchDistance(
    touch1,
    touch2
  ) {

    const dx =
      touch2.clientX -
      touch1.clientX;

    const dy =
      touch2.clientY -
      touch1.clientY;


    return Math.sqrt(
      dx * dx +
      dy * dy
    );

  }


  /* =========================================
     UPDATE VIEWER IMAGE
  ========================================== */

  function updateImage() {

    if (!viewerImage) {
      return;
    }


    viewerImage.style.transform =
      `translate(${imageX}px, ${imageY}px) scale(${scale})`;

  }


  /* =========================================
     OPEN VIEWER
  ========================================== */

  function openViewer(
    imageUrl,
    altText
  ) {

    if (!viewer) {
      createViewer();
    }


    viewerImage.src =
      imageUrl;


    viewerImage.alt =
      altText ||
      "Portfolio image";


    scale = 1;

    imageX = 0;

    imageY = 0;

    dragging = false;


    updateImage();


    viewer.style.display =
      "flex";


    document.body.style.overflow =
      "hidden";

  }


  /* =========================================
     CLOSE VIEWER
  ========================================== */

  function closeViewer() {

    if (!viewer) {
      return;
    }


    viewer.style.display =
      "none";


    document.body.style.overflow =
      "";


    scale = 1;

    imageX = 0;

    imageY = 0;

    dragging = false;

  }


  /* =========================================
     LOAD PORTFOLIO
  ========================================== */

  async function loadPortfolio() {

    if (!categoriesContainer) {
      return;
    }


    categoriesContainer.innerHTML =
      "<p>Loading portfolio...</p>";


    const {
      data,
      error
    } =
      await supabaseClient
        .from("portfolio_items")
        .select(`
          id,
          title,
          category,
          image_url,
          description,
          sort_order,
          is_featured,
          created_at
        `)
        .eq(
          "is_published",
          true
        )
        .order(
          "sort_order",
          {
            ascending: true
          }
        )
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    if (error) {

      console.error(
        "Portfolio loading error:",
        error
      );


      categoriesContainer.innerHTML =
        "<p>Unable to load portfolio. Please try again later.</p>";

      return;

    }


    portfolioItems =
      Array.isArray(data)
        ? data
        : [];


    renderFeatured();

    renderCategories();

  }


  /* =========================================
     FEATURED WORK
  ========================================== */

  function renderFeatured() {

    const featuredSection =
      document.getElementById(
        "featuredSection"
      );


    const featuredGrid =
      document.getElementById(
        "featuredGrid"
      );


    if (
      !featuredSection ||
      !featuredGrid
    ) {
      return;
    }


    const featuredItems =
      portfolioItems.filter(
        item =>
          item.is_featured === true
      );


    if (
      featuredItems.length === 0
    ) {

      featuredSection.style.display =
        "none";


      featuredGrid.innerHTML =
        "";


      return;

    }


    featuredSection.style.display =
      "block";


    featuredGrid.innerHTML =
      "";


    featuredItems.forEach(
      item => {

        const card =
          document.createElement(
            "div"
          );


        card.className =
          "featured-card";


        const image =
          document.createElement(
            "img"
          );


        image.src =
          item.image_url;


        image.alt =
          item.title ||
          "Featured photography";


        image.loading =
          "lazy";


        image.draggable =
          false;


        card.appendChild(
          image
        );


        card.addEventListener(
          "click",
          () => {

            openViewer(
              item.image_url,
              image.alt
            );

          }
        );


        featuredGrid.appendChild(
          card
        );

      }
    );

  }


  /* =========================================
     RENDER PORTFOLIO CATEGORIES
  ========================================== */

  function renderCategories() {

    categoriesContainer.innerHTML =
      "";


    if (
      portfolioItems.length === 0
    ) {

      categoriesContainer.innerHTML =
        "<p>No portfolio images are currently available.</p>";

      return;

    }


    const categories = {};


    portfolioItems.forEach(
      item => {

        const category =
          item.category ||
          "other";


        const key =
          category
            .toLowerCase()
            .trim();


        if (!categories[key]) {

          categories[key] = {

            name:
              category,

            items:
              []

          };

        }


        categories[key]
          .items
          .push(item);

      }
    );


    Object.keys(categories)
      .forEach(
        categoryKey => {

          const category =
            categories[
              categoryKey
            ];


          const items =
            category.items;


          if (
            !items.length
          ) {
            return;
          }


          const categoryCard =
            document.createElement(
              "a"
            );


          categoryCard.href =
            "#";


          categoryCard.className =
            "portfolio-category-card";


          categoryCard.innerHTML = `

            <div class="portfolio-image">

              <img
                src="${escapeHtmlAttribute(
                  items[0].image_url
                )}"
                alt="${escapeHtmlAttribute(
                  formatCategoryName(
                    category.name
                  ) +
                  " photography"
                )}"
                loading="lazy"
              >

            </div>

            <div class="portfolio-info">

              <h3>
                ${escapeHtml(
                  formatCategoryName(
                    category.name
                  )
                )}
              </h3>

              <span>
                ${items.length}
                ${
                  items.length === 1
                    ? "photo"
                    : "photos"
                }
              </span>

            </div>

          `;


          categoryCard.addEventListener(
            "click",
            event => {

              event.preventDefault();


              openCategory(
                category.name
              );

            }
          );


          categoriesContainer
            .appendChild(
              categoryCard
            );

        }
      );

  }


  /* =========================================
     OPEN CATEGORY
  ========================================== */

  function openCategory(
    categoryName
  ) {

    const items =
      portfolioItems.filter(
        item => {

          return (
            (
              item.category ||
              "other"
            )
              .toLowerCase()
              .trim() ===
            categoryName
              .toLowerCase()
              .trim()
          );

        }
      );


    if (
      !items.length
    ) {
      return;
    }


    categoriesContainer
      .classList
      .add(
        "hidden"
      );


    if (galleryContainer) {

      galleryContainer
        .classList
        .add(
          "active"
        );

    }


    if (galleryEyebrow) {

      galleryEyebrow.textContent =
        "PORTFOLIO";

    }


    if (galleryTitle) {

      galleryTitle.textContent =
        formatCategoryName(
          categoryName
        );

    }


    if (galleryDescription) {

      galleryDescription.textContent =
        getCategoryDescription(
          categoryName
        );

    }


    if (!galleryGrid) {
      return;
    }


    galleryGrid.innerHTML =
      "";


    items.forEach(
      item => {

        const galleryItem =
          document.createElement(
            "div"
          );


        galleryItem.className =
          "gallery-item";


        const image =
          document.createElement(
            "img"
          );


        image.src =
          item.image_url;


        image.alt =
          item.title ||
          formatCategoryName(
            categoryName
          ) +
          " photography";


        image.loading =
          "lazy";


        image.draggable =
          false;


        galleryItem.appendChild(
          image
        );


        galleryItem.addEventListener(
          "click",
          () => {

            openViewer(
              item.image_url,
              image.alt
            );

          }
        );


        galleryGrid.appendChild(
          galleryItem
        );

      }
    );


    const portfolioSection =
      document.getElementById(
        "portfolio"
      );


    if (
      portfolioSection
    ) {

      portfolioSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

  }


  /* =========================================
     BACK TO PORTFOLIO
  ========================================== */

  if (backButton) {

    backButton.addEventListener(
      "click",
      event => {

        event.preventDefault();


        if (galleryContainer) {

          galleryContainer
            .classList
            .remove(
              "active"
            );

        }


        if (categoriesContainer) {

          categoriesContainer
            .classList
            .remove(
              "hidden"
            );

        }


        const portfolioSection =
          document.getElementById(
            "portfolio"
          );


        if (
          portfolioSection
        ) {

          portfolioSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      }
    );

  }


  /* =========================================
     NEWSLETTER
  ========================================== */

  const newsletterForm =
    document.querySelector(
      "[data-newsletter-form]"
    );


  if (newsletterForm) {

    newsletterForm.addEventListener(
      "submit",
      async event => {

        event.preventDefault();


        const emailInput =
          newsletterForm.querySelector(
            "input[type='email']"
          );


        if (!emailInput) {
          return;
        }


        const email =
          emailInput.value
            .trim()
            .toLowerCase();


        if (!email) {
          return;
        }


        const {
          error
        } =
          await supabaseClient
            .from(
              "newsletter_subscribers"
            )
            .insert([
              {
                email:
                  email
              }
            ]);


        if (error) {

          if (
            error.code ===
            "23505"
          ) {

            alert(
              "You are already subscribed."
            );

          } else {

            console.error(
              "Newsletter error:",
              error
            );

            alert(
              "Unable to subscribe right now."
            );

          }

          return;

        }


        alert(
          "Thank you for subscribing!"
        );


        newsletterForm.reset();

      }
    );

  }


  /* =========================================
     START WEBSITE
  ========================================== */

  await loadSiteSettings();

  await loadPortfolio();

  await loadPublicServices();

  await loadPublicTestimonials();

});