<?php

namespace DTB\BdBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Tag
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="DTB\BdBundle\Entity\TagRepository")
 */
class Tag
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @ORM\ManyToMany(targetEntity="DTB\BdBundle\Entity\BandeDessinee", mappedBy="tags")
     */
    private $bandesDessinees; 
    
    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Tag
     */
    public function setName($name)
    {
        $this->name = $name;
    
        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->bandesDessinees = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Add bandesDessinees
     *
     * @param \DTB\BdBundle\Entity\BandeDessinee $bandesDessinees
     * @return Tag
     */
    public function addBandesDessinee(\DTB\BdBundle\Entity\BandeDessinee $bandesDessinees)
    {
        $this->bandesDessinees[] = $bandesDessinees;
    
        return $this;
    }

    /**
     * Remove bandesDessinees
     *
     * @param \DTB\BdBundle\Entity\BandeDessinee $bandesDessinees
     */
    public function removeBandesDessinee(\DTB\BdBundle\Entity\BandeDessinee $bandesDessinees)
    {
        $this->bandesDessinees->removeElement($bandesDessinees);
    }

    /**
     * Get bandesDessinees
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getBandesDessinees()
    {
        return $this->bandesDessinees;
    }
    
    public function __toString()
    {
        return $this->name;
    }
}