<?php

namespace DTB\BdBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Categorie
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="DTB\BdBundle\Entity\CategorieRepository")
 */
class Categorie {

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
     * @var integer
     *
     * @ORM\Column(name="requiredAge", type="integer")
     */
    private $requiredAge;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text")
     */
    private $description;

    /**
     * @ORM\OneToMany(targetEntity="DTB\BdBundle\Entity\BandeDessinee", mappedBy="category")
     */
    private $bandesDessinees;
    
    /**
     * Get id
     *
     * @return integer 
     */

    public function getId() {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Categorie
     */
    public function setName($name) {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName() {
        return $this->name;
    }

    /**
     * Set RequiredAge
     *
     * @param integer $requiredAge
     * @return Categorie
     */
    public function setRequiredAge($requiredAge) {
        $this->requiredAge = $requiredAge;

        return $this;
    }

    /**
     * Get RequiredAge
     *
     * @return integer 
     */
    public function getRequiredAge() {
        return $this->requiredAge;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return Categorie
     */
    public function setDescription($description) {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string 
     */
    public function getDescription() {
        return $this->description;
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
     * @return Categorie
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