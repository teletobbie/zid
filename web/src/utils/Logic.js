import ApplicationList from '../api/ApplicationList';
import vlans from '../static/vlans.json'

/**
 * Check if diagram block with serverRole value database is in the Green zone.
 * @param {object} data current diagram block
 * @returns {boolean} returns false if not in the correct zone, true if it is. 
 */
const dbInCorrectZone = data => {
  //TODO remove this condition when mssql start instance is fixed...
  if (data.inputs.serverRole === 'database') { 
    return false
  }
  if (data.inputs.zone !== 'green' && data.inputs.serverRole === 'database') {
    return false
  }
  return true
}

/**
 * Recursively loop over the diagram data and check if it has diagram errors.
 * @param {object} data diagram data 
 * @returns {boolean} true if diagram has errors, false is it hasn't. 
 */
export const DiagramHasError = (data) => {
  let hasErr = false;

  const loopOverItems = items => {
    for (const i of items) {
      if (Object.keys(i.inputErrors).length || !dbInCorrectZone(i)) {
        // hasErr = 'The drawn diagram has errors'
        hasErr = true;
        break
      }
      loopOverItems(i.next)
    }
  }
  loopOverItems(data)
  return hasErr;
}

/**
 * Returns a object array of datacenter locations by current platform choice. 
 * @param {object} info diagram block.
 * @returns {object[]} object array of locations.
 */
const hasLocations = info => {
  switch (info.inputs.platform) {
    case 'vipernext':
      return [
        {
          name: 'location',
          title: 'Location',
          type: 'dropdown',
          default: '',
          options: [
            { title: 'Amsterdam', value: 'Amsterdam' },
            { title: 'Rotterdam', value: 'Rotterdam'},
            { title: 'Arnhem', value: 'Arnhem'}
          ],
          advanced: true,
          validation: (_, input) => {
            return input !== '' ? true : 'Choose a location.'
          }
        }
      ]
    case 'tailoredhosting':
      return [
        {
          name: 'location',
          title: 'Location',
          type: 'dropdown',
          default: '',
          options: [
            { title: 'Haarlem', value: 'Haarlem' },
            { title: 'Aalsmeer', value: 'Aalsmeer'}
          ],
          advanced: true,
          validation: (_, input) => {
            return input !== '' ? true : 'Choose a location.'
          }
        }
      ]
    case 'BDMZ':
      return [
        {
          name: 'location',
          title: 'Location',
          type: 'dropdown',
          default: '',
          options: [
            { title: 'Amsterdam', value: 'Amsterdam' },
            { title: 'Rotterdam', value: 'Rotterdam'},
          ],
          advanced: true,
          validation: (_, input) => {
            return input !== '' ? true : 'Choose a location.'
          }
        }
      ]
    default:
      return [
        {
          name: 'location',
          title: 'Location',
          type: 'dropdown',
          default: '',
          options: [
            {title: 'no-locations', value: '', tooltip: 'no locations could be found for platform'}
          ],
          advanced: true,
          validation: (_, input) => {
            return input !== '' ? true : 'Choose a location.'
          }
        }
      ]
  }
}

/**
 * Returns a array of possible frontend subnet options by environment, networklot, location and zone choice. 
 * @param {object} info diagram block.
 * @param {string} environment current project environment.
 * @returns {object[]} array of possible frontend subnet options.
 */
const hasFrontends = (info, environment) => {
  var frontendSubnetsList = vlans.VLANS.filter(function (vlan) {
    return vlan.ENVIRONMENT === environment &&
    vlan.KAVEL === info.inputs.networklot && 
    vlan.LOCATION === info.inputs.location &&
    vlan.ZONE.toLowerCase() === info.inputs.zone
  });
  return [
    {
      name: 'frontendSubnet',
      title: 'Frontend subnet',
      type: 'dropdown',
      default: frontendSubnetsList.length > 0 ? frontendSubnetsList[0].IP_SUBNET : '',
      options: [
        ...(frontendSubnetsList.length ? frontendSubnetsList.map(frontend => (
          {title: frontend.IP_SUBNET, value: frontend.IP_SUBNET})) 
          : [{title: '', value: ''}])
      ],
      advanced: true,
      validation: (_, input) => {
        return input !== '' ? true : 'There are no frontend subnets found. Please check networklot, location and zone fields.'
      }
    }
  ]
}

/**
 * Returns a array of possible applications by filtering the applications array by the current appsearch value. 
 * @param {object} info diagram block.
 * @param {object[]} applications array of KPN applications.
 * @returns {object[]} array of possible applications.
 */
const applicationSearch = (info, applications) => {
  if (info.inputs.appsearch && applications) {
    var query = info.inputs.appsearch.toLowerCase()
    var searchResult = applications.filter(function (app) {
      return app.name.toLowerCase().includes(query) || app.sid.toLowerCase().includes(query)
    })
    return [
      {
        name: 'applicationName',
        title: 'Application name',
        type: 'dropdown',
        default: searchResult.length ? searchResult[0].name + ' - ' + searchResult[0].sid : 'no-app',
        options: [
          ...(searchResult.length ? searchResult.map(app => (
            {title: app.name, value: app.name + ' - ' + app.sid}))
            : [{title: 'no-app', value: 'no-app'}])    
        ],
        advanced: true,
        validation: (_, input) => {
          return input !== 'no-app' && input !== '' ? true : `No applications with searchquery '${info.inputs.appsearch}' could be found.`
        }
      }
    ]
  } else {
    return [] 
  }
}

/**
 * Returns a Array of with database fields if the serverRole equals database. 
 * @param {object} info diagram block
 * @returns {object[]} object array with database fields.
 */
const hasDB = info => {
  if(info.inputs.serverRole === 'database') {
    return [
      {
        name: 'databasename',
        title: 'Database name',
        type: 'text',
        tooltip: 'Only works in the Green zone',
        default: '',
        advanced: true,
        validation: (_, input) => {
          return input !== '' ? true : 'No database name'
        }
      },
      {
        name: 'sqledition',
        title: 'SQL-edition',
        type: 'dropdown',
        tooltip: 'Only works in the Green zone',
        default: '',
        options: [
          { title: 'Stand-alone', value: 'standalone' },
          { title: 'Enterprise', value: 'enterprise' }
        ],
        advanced: true,
        validation: (_, input) => {
          return input !== '' ? true : 'No database edition selected'
        }
      },
    ]
  } else {
    return []
  }
}

/**
 * Returns possible operating systems by serverRole choice.
 * @param {object} info diagram block
 * @returns {object[]} array of operating systems fields. 
 */
const operatingSystem = info => {
  if(info.inputs.serverRole === 'database') {
    return [
      {
        name: 'os',
        title: 'OS',
        type: 'dropdown',
        default: '',
        options: [
          { title: 'Windows Server 2021r2', value: 'windows2012r2' },
          { title: 'Windows Server 2016 Std Ed', value: 'windows2016' }
        ],
        validation: (_, input) => {
          return input !== '' ? true : 'Choose an OS.'
        }
      },
      
    ]
  } else {
    return [
      {
        name: 'os',
        title: 'OS',
        type: 'dropdown',
        default: '',
        options: [
          { title: 'CentOS Linux 7', value: 'centos7' },
          { title: 'CentOS Linux 8', value: 'centos8' },
          { title: 'Linux Flatcar', value: 'linuxflatcar' },
          { title: 'Windows Server 2021r2', value: 'windows2012r2' },
          { title: 'Windows Server 2016 Std Ed', value: 'windows2016' }
        ],
        validation: (_, input) => {
          return input !== '' ? true : 'Choose an OS.'
        }
      },
    ]
  }
}

/**
 * Returns a Diagram Logic Object needed the initialize the diagram field options.
 * @param {string} environment current project environment.
 * @returns {Object} A Diagram Logic Object. 
 */
const Logic = async (environment) => {
  var applications = await ApplicationList() 
  return {
    introComponents: [
      'VM'
    ],

    components: [
      {
        name: 'VM',
        title: 'Virtual machine',
        tooltip: 'Virtual machine to be deployed.',
        getInputs(info) {
          const getlocations = hasLocations(info);
          const getFrontends = hasFrontends(info, environment);
          const searchResult = applicationSearch(info, applications);
          const withDB = hasDB(info);
          const OS = operatingSystem(info)
          return [
            {
              name: 'VMname',
              title: 'VM-name',
              value: 'name',
              type: 'text',
              validation: (_, input) => {
                return input !== '' ? true : 'Fill in a VM-name.'
              }
            },
            {
              name: 'serverRole',
              title: 'Server role',
              type: 'dropdown',
              default: 'app',
              options: [
                { title: 'App', value: 'app' },
                { title: 'Database', value: 'database', tooltip: 'Choose this option if you want a VM and a database deployment. (only in the Green zone!)'},
                { title: 'Proxy', value: 'proxy' },
                { title: 'Web', value: 'web' }
              ], 
              validation: (_, input) => {
                return input !== '' ? true : 'Choose a role for this block.'
              }
            },
            ...OS,
            {
              name: 'appsearch',
              title: 'Application search',
              value: '',
              type: 'text',
              tooltip: 'Search here for available applications on name or sid.',
              advanced: true,
              validation: (_, input) => {
                return input !== '' ? true : 'Search for a application by name or sid.'
              }
            },
            ...searchResult,
            {
              name: 'platform',
              title: 'Platform',
              type: 'dropdown',
              default: 'vipernext',
              options: [
                { title: 'Vipernext', value: 'vipernext' },
                { title: 'Tailoredhosting', value: 'tailoredhosting' },
                { title: 'BDMZ', value: 'BDMZ' }
              ],
              advanced: true,
              validation: (_, input) => {
                return input !== '' ? true : 'Choose a platform'
              }
            },
            ...getlocations,
            {
              name: 'msp',
              title: 'MSP',
              type: 'dropdown',
              default: 'Cognizant',
              options: [
                { title: 'Cognizant', value: 'Cognizant' },
                { title: 'TechMahindra', value: 'Techmahindra' }
              ],
              advanced: true,
              validation: (_, input) => {
                return input !== '' ? true : 'Choose a MSP.'
              }
            },
            {
              name: 'zone',
              title: 'Zone',
              type: 'dropdown',
              default: 'red',
              options: [
                { title: 'Red', value: 'red' },
                { title: 'Orange', value: 'orange' },
                { title: 'Green', value: 'green' }
              ],
              advanced: true,
              validation: (_, input) => {
                return input !== '' ? true : 'Choose a network zone'
              }
            },
            {
              name: 'networklot',
              title: 'Networklot',
              type: 'dropdown',
              default: 'BSS',
              options: [
                { title: 'BSS', value: 'BSS' },
                { title: 'OSS', value: 'OSS' },
                { title: 'WS', value: 'Workspace' },
              ],
              advanced: true,
              validation: (_, input) => {
                return input !== '' ? true : 'Choose a networklot.'
              }
            },
            ...getFrontends,
            {
              name: 'cpu',
              title: 'Processors',
              type: 'dropdown',
              default: '2',
              options: [
                { title: '1', value: '1' },
                { title: '2', value: '2' },
                { title: '4', value: '4' },
                { title: '8', value: '8' },
              ],
              advanced: true,
              validation: (_, input) => {
                return input !== '' ? true : 'Choose amount of processors'
              }
            },
            {
              name: 'memory',
              title: 'Memory',
              type: 'dropdown',
              tooltip: 'Working memory (RAM)',
              default: '2',
              options: [
                { title: '2', value: '2' },
                { title: '4', value: '4' },
                { title: '8', value: '8' },
                { title: '16', value: '16' },
              ],
              advanced: true,
              validation: (_, input) => {
                return input !== '' ? true : 'Choose amount of RAM'
              }
            },
            {
              name: 'storage',
              title: 'Additional storage (GB)',
              type: 'number',
              default: 0,
              advanced: true,
              validation: (_, input) => {
                return input >= 0 && input % 1 === 0 ? true : 'Must be a whole number above or equal to 0.'
              }
            },
            ...withDB
          ]
        },
        next: 'VM'
      }
    ]
  }
}

export default Logic;