import tar from 'tar-stream'

/**
 *
 * @param vmName
 * @param vmDescription
 * @param disks
 * @returns readStream
 */
export async function createOvaStream({ vmName, vmDescription, disks }) {
  const ovf = createOvf(vmName, vmDescription, disks)
  const pack = tar.pack()
  pack.entry({ name: 'vmName.ovf' }, Buffer.from(ovf, 'utf8'))
  for (const disk of disks) {
    pack.entry()
  }
  return pack
}

function createOvf(vmName, vmDescription, vmdkFileName) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!--Generated by Xen Orchestra-->
<Envelope xmlns="http://schemas.dmtf.org/ovf/envelope/1" xmlns:cim="http://schemas.dmtf.org/wbem/wscim/1/common" xmlns:ovf="http://schemas.dmtf.org/ovf/envelope/1" xmlns:rasd="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_ResourceAllocationSettingData" xmlns:vssd="http://schemas.dmtf.org/wbem/wscim/1/cim-schema/2/CIM_VirtualSystemSettingData" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <References>
    <File ovf:href="${vmdkFileName}" ovf:id="file1" ovf:size="76934656" />
  </References>
  <DiskSection>
    <Info>Virtual disk information</Info>
    <Disk ovf:capacity="128" ovf:capacityAllocationUnits="byte * 2^20" ovf:diskId="vmdisk1" ovf:fileRef="file1" ovf:populatedSize="82313216" />
  </DiskSection>
  <NetworkSection>
    <Info>The list of logical networks</Info>
    <Network ovf:name="LAN">
      <Description>The LAN network</Description>
    </Network>
  </NetworkSection>
  <VirtualSystem ovf:id="dsl">
    <Info>A virtual machine</Info>
    <Name>${vmName}</Name>
    <OperatingSystemSection ovf:id="1">
      <Info>The kind of installed guest operating system</Info>
    </OperatingSystemSection>
    <VirtualHardwareSection>
      <Info>Virtual hardware requirements</Info>
      <System>
        <vssd:ElementName>Virtual Hardware Family</vssd:ElementName>
        <vssd:InstanceID>0</vssd:InstanceID>
        <vssd:VirtualSystemIdentifier>dsl</vssd:VirtualSystemIdentifier>
        <vssd:VirtualSystemType>vmx-11</vssd:VirtualSystemType>
      </System>
      <Item>
        <rasd:AllocationUnits>hertz * 10^6</rasd:AllocationUnits>
        <rasd:Description>Number of Virtual CPUs</rasd:Description>
        <rasd:ElementName>1 virtual CPU(s)</rasd:ElementName>
        <rasd:InstanceID>1</rasd:InstanceID>
        <rasd:ResourceType>3</rasd:ResourceType>
        <rasd:VirtualQuantity>1</rasd:VirtualQuantity>
      </Item>
      <Item>
        <rasd:AllocationUnits>byte * 2^20</rasd:AllocationUnits>
        <rasd:Description>Memory Size</rasd:Description>
        <rasd:ElementName>64MB of memory</rasd:ElementName>
        <rasd:InstanceID>2</rasd:InstanceID>
        <rasd:ResourceType>4</rasd:ResourceType>
        <rasd:VirtualQuantity>64</rasd:VirtualQuantity>
      </Item>
      <Item>
        <rasd:Address>1</rasd:Address>
        <rasd:Description>IDE Controller</rasd:Description>
        <rasd:ElementName>VirtualIDEController 1</rasd:ElementName>
        <rasd:InstanceID>3</rasd:InstanceID>
        <rasd:ResourceType>5</rasd:ResourceType>
      </Item>
      <Item>
        <rasd:Address>0</rasd:Address>
        <rasd:Description>IDE Controller</rasd:Description>
        <rasd:ElementName>VirtualIDEController 0</rasd:ElementName>
        <rasd:InstanceID>4</rasd:InstanceID>
        <rasd:ResourceType>5</rasd:ResourceType>
      </Item>
      <Item ovf:required="false">
        <rasd:AutomaticAllocation>false</rasd:AutomaticAllocation>
        <rasd:ElementName>VirtualVideoCard</rasd:ElementName>
        <rasd:InstanceID>5</rasd:InstanceID>
        <rasd:ResourceType>24</rasd:ResourceType>
      </Item>
      <Item>
        <rasd:AddressOnParent>0</rasd:AddressOnParent>
        <rasd:ElementName>Hard Disk 1</rasd:ElementName>
        <rasd:HostResource>ovf:/disk/vmdisk1</rasd:HostResource>
        <rasd:InstanceID>8</rasd:InstanceID>
        <rasd:Parent>4</rasd:Parent>
        <rasd:ResourceType>17</rasd:ResourceType>
      </Item>
      <Item>
        <rasd:AddressOnParent>7</rasd:AddressOnParent>
        <rasd:AutomaticAllocation>true</rasd:AutomaticAllocation>
        <rasd:Connection>LAN</rasd:Connection>
        <rasd:Description>PCNet32 ethernet adapter on "LAN"</rasd:Description>
        <rasd:ElementName>Ethernet 1</rasd:ElementName>
        <rasd:InstanceID>9</rasd:InstanceID>
        <rasd:ResourceSubType>PCNet32</rasd:ResourceSubType>
        <rasd:ResourceType>10</rasd:ResourceType>

      </Item>
    </VirtualHardwareSection>
    <AnnotationSection ovf:required="false">
      <Info>A human-readable annotation</Info>
      <Annotation>${vmDescription}</Annotation>
    </AnnotationSection>
  </VirtualSystem>
</Envelope>`
}
