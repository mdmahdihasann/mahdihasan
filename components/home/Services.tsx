import { services } from "@/data/services";

const Services = () => {
  return (
    <section id="services" aria-labelledby="services-title">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="eyebrow">
            <span className="num">05</span> {"// What I Do"}
          </p>
          <h2 className="section-title" id="services-title">
            Services I <span className="grad">Offer</span>
          </h2>
          <p className="section-sub">
            End-to-end development, from first pixel to production deploy.
          </p>
        </div>

        <div className="services-grid" id="servicesGrid">
          {services.map((service) => (
            <article
              className="glass service-card reveal lift spotlight"
              key={service.name}
            >
              <div className="service-icon" aria-hidden>
                {service.icon}
              </div>
              <h3>{service.name}</h3>
              <p>{service.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
