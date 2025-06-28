import AdaptivePaginatableTable from "@components/atoms/AdaptivePaginatableTable";
import {resolveExample} from "./paramResolvers/exampleResolver"
import ServiceProvidersPage from "@pages/ServiceProvidersPage";

function getNavLinks(userContext) {
  let nav = [];

  nav.push({
    title: "Service Providers",
    icon: "manage_accounts",
    page: <ServiceProvidersPage />,
    path: ["/service-providers"],
  });
  nav.push({
    title: "Example",
    icon: "help",
    page: "",
    sub: [
      {
        path: [`/examples`],
        title: "Example Sub 1",
        icon: "manage_accounts",
        page: "Example Sub Page 1",
        subNav: [
          {
            path: [`/examples/:exampleId/sub1`],
            title: "Example Sub Nav 1",
            icon: "account_circle",
            page: <AdaptivePaginatableTable
              title="Example Sub Nav Page 1"
              subtitle="This is an example subtitle"
              numbered={true}
              headers={[
                {
                  colKey: "name",
                  label: "Name",
                },
                {
                  colKey: "email",
                  label: "Email",
                },
                {
                  colKey: "phone",
                  label: "Phone",
                }
              ]}
              data={[
                { name: "John Doe", email: "example@abc.com", phone: "+1234567890" },
                { name: "John Doe", email: "example@abc.com", phone: "+1234567890" },
                { name: "John Doe", email: "example@abc.com", phone: "+1234567890" },
                { name: "John Doe", email: "example@abc.com", phone: "+1234567890" },
                { name: "John Doe", email: "example@abc.com", phone: "+1234567890" },
                { name: "John Doe", email: "example@abc.com", phone: "+1234567890" },
                { name: "John Doe", email: "example@abc.com", phone: "+1234567890" },
                { name: "John Doe", email: "example@abc.com", phone: "+1234567890" }
              ]}
              pagination={5}
              isSettingsBtn={true}
              isAddBtn={true}
              isExportBtn={true}
            />,
            paramResolvers: {
              //tenantId: resolveCustomers
            }
          },
          {
            path: [`/examples/:exampleId/sub2`],
            title: "Example Sub Nav 2",
            icon: "receipt_long",
            page: "Example Sub Nav Page 2",
            paramResolvers: {
              //tenantId: resolveCustomers
            }
          }
        ]
      },
      {
        path: [`/example/:exampleId`],
        title: "Example Sub 2",
        icon: "account_circle",
        page: "Example Sub Page 2",
      }
    ],
  });


  if (userContext.role === "instructor") {
  }

  if (userContext.role === "administrator") {
  }

  return processNavLinks(nav);
}

function processNavLinks(nav) {
    nav.forEach(navItem => {
    // Check main nav items for subNav
    if (navItem.subNav && Array.isArray(navItem.subNav)) {
      const defaultItem = {
        path: navItem.path,
        title: "Default",
        page: navItem.page,
        icon: navItem.icon,
        paramResolvers: navItem.paramResolvers
      };
      navItem.subNav.unshift(defaultItem);
    }

    // Check sub items for subNav
    if (navItem.sub) {
      navItem.sub.forEach(subItem => {
        if (subItem.subNav && Array.isArray(subItem.subNav)) {
          const defaultItem = {
            path: subItem.path,
            title: "Default",
            page: subItem.page,
            icon: subItem.icon,
            paramResolvers: subItem.paramResolvers
          };
          subItem.subNav.unshift(defaultItem);
        }
      });
    }
  });

  return nav;
}

export { getNavLinks };
